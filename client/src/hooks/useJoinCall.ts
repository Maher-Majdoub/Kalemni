import { Socket } from "socket.io-client";

interface IPeer {
  id: string;
  connection: RTCPeerConnection;
  stream: MediaStream | null;
}

interface Props {
  conversationId: string | undefined;
  callType: string | null;
  localStreamRef: React.MutableRefObject<MediaStream | null>;
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  onUpdateRemoteMedias(peers: IPeer[]): void;
}

const peers: Map<string, IPeer> = new Map();

const useJoinCall = ({
  conversationId,
  callType,
  localStreamRef,
  localVideoRef,
  onUpdateRemoteMedias,
}: Props) => {
  const joinCall = async (socket: Socket) => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: callType === "video",
      audio: true,
    });

    localStreamRef.current = localStream;

    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

    socket.emit("join", conversationId, callType ? callType : "audio");

    socket.on("newParticipant", async (id: string) => {
      const pc = new RTCPeerConnection();
      peers.set(id, { id: id, connection: pc, stream: null });

      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      pc.ontrack = (e) => {
        peers.set(id, { id: id, connection: pc, stream: e.streams[0] });
        onUpdateRemoteMedias(Array.from(peers.values()));
      };

      pc.onicecandidate = (e) => {
        if (e.candidate)
          socket.emit("iceCandidate", conversationId, id, e.candidate);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", id, offer);
    });

    socket.on("offer", async (id, offer) => {
      const pc = new RTCPeerConnection();
      peers.set(id, { id: id, connection: pc, stream: null });

      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));

      pc.ontrack = (e) => {
        peers.set(id, { id, connection: pc, stream: e.streams[0] });
        onUpdateRemoteMedias(Array.from(peers.values()));
      };

      pc.onicecandidate = (e) => {
        if (e.candidate)
          socket.emit("iceCandidate", conversationId, id, e.candidate);
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", id, answer);
    });

    socket.on("answer", (id, answer) => {
      const pc = peers.get(id);
      pc?.connection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("iceCandidate", (id, candidate) => {
      const pc = peers.get(id);
      pc?.connection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("videoOffer", async (id, offer) => {
      const peer = peers.get(id);
      if (!peer) return;

      await peer.connection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peer.connection.createAnswer();
      await peer.connection.setLocalDescription(answer);
      socket.emit("videoAnswer", id, answer);

      peers.set(id, peer);
    });

    socket.on("videoAnswer", async (id, answer) => {
      const peer = peers.get(id);
      if (!peer) return;

      await peer.connection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("toggleEnableVideo", (userId, isVideoEnabled) => {
      console.log(userId, isVideoEnabled);
    });

    socket.on("toggleEnableAudio", (userId, isAudioEnabled) => {
      console.log(userId, isAudioEnabled);
    });

    socket.on("participantLeft", (id) => {
      const pc = peers.get(id);
      if (pc) {
        pc.connection.close();
        peers.delete(id);
        onUpdateRemoteMedias(Array.from(peers.values()));
      }
    });
  };

  const toggleEnableVideo = async ({
    socket,
    enableVideo,
  }: {
    socket: Socket;
    enableVideo: boolean;
  }) => {
    if (!localStreamRef.current) return;

    if (!enableVideo && localStreamRef.current?.getVideoTracks().length === 0) {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoStream.getTracks().forEach((track) => {
        localStreamRef.current?.addTrack(track);
      });

      peers.forEach(async (peer) => {
        if (!localStreamRef.current) return;

        peer.connection.addTrack(
          videoStream.getVideoTracks()[0],
          localStreamRef.current
        );

        const offer = await peer.connection.createOffer();
        await peer.connection.setLocalDescription(offer);

        socket?.emit("videoOffer", peer.id, offer);
      });
    }
    socket?.emit("toggleEnableVideo", conversationId, !enableVideo);

    localStreamRef.current
      .getVideoTracks()
      .forEach((track) => (track.enabled = !enableVideo));
  };

  const toggleEnableAudio = ({
    socket,
    enableAudio,
  }: {
    socket: Socket;
    enableAudio: boolean;
  }) => {
    socket?.emit("toggleEnableAudio", conversationId, !enableAudio);

    if (localStreamRef.current)
      localStreamRef.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = !enableAudio));
  };

  const cleanup = (socket: Socket | null) => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peers.clear();
      socket?.off("newParticipant");
      socket?.off("offer");
      socket?.off("answer");
      socket?.off("iceCandidate");
      socket?.off("participantLeft");
      socket?.off("videoOffer");
      socket?.off("videoAnswer");
      socket?.off("toggleEnableVideo");
      socket?.off("toggleEnableAudio");
      socket?.emit("leaveCall", conversationId);
    };
  };

  return { joinCall, toggleEnableVideo, toggleEnableAudio, cleanup };
};

export default useJoinCall;
