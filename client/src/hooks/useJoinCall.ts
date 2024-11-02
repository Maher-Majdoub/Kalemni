import { Socket } from "socket.io-client";
import { IUserSnapshot } from "./useFriends";
import { useCallback } from "react";

export interface IPeer {
  user: IUserSnapshot;
  connection: RTCPeerConnection;
  stream: MediaStream | null;
  videoEnabled: boolean;
  audioEnabled: boolean;
}

interface Props {
  conversationId: string | undefined;
  callType: string | null;
  localStreamRef: React.MutableRefObject<MediaStream | null>;
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  onUpdateRemoteMedias(peers: IPeer[]): void;
  onFullCall(): void;
}

const peers: Map<string, IPeer> = new Map();

const turnServerUsername = import.meta.env.VITE_TURN_USERNAME;
const turnServerCredential = import.meta.env.VITE_TURN_CREDENTIAL;

const iceServers = [
  {
    urls: "stun:stun.relay.metered.ca:80",
  },
  {
    urls: "turn:global.relay.metered.ca:80",
    username: turnServerUsername,
    credential: turnServerCredential,
  },
  {
    urls: "turn:global.relay.metered.ca:80?transport=tcp",
    username: turnServerUsername,
    credential: turnServerCredential,
  },
  {
    urls: "turn:global.relay.metered.ca:443",
    username: turnServerUsername,
    credential: turnServerCredential,
  },
  {
    urls: "turns:global.relay.metered.ca:443?transport=tcp",
    username: turnServerUsername,
    credential: turnServerCredential,
  },
];

const useJoinCall = ({
  conversationId,
  callType,
  localStreamRef,
  localVideoRef,
  onUpdateRemoteMedias,
  onFullCall,
}: Props) => {
  const joinCall = useCallback(
    async (socket: Socket) => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: callType === "video",
          audio: true,
        });

        localStreamRef.current = localStream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        socket.emit("join", conversationId, callType || "audio");

        socket.on("newParticipant", async (user: IUserSnapshot) => {
          if (!peers.has(user._id)) {
            const pc = new RTCPeerConnection({ iceServers });
            peers.set(user._id, {
              user,
              connection: pc,
              stream: null,
              videoEnabled: false,
              audioEnabled: false,
            });

            localStream
              .getTracks()
              .forEach((track) => pc.addTrack(track, localStream));

            pc.ontrack = (e) => {
              peers.set(user._id, {
                user,
                connection: pc,
                stream: e.streams[0],
                audioEnabled: e.streams[0].getAudioTracks().length !== 0,
                videoEnabled: e.streams[0].getVideoTracks().length !== 0,
              });
              onUpdateRemoteMedias(Array.from(peers.values()));
            };

            pc.onicecandidate = (e) => {
              if (e.candidate) {
                socket.emit(
                  "iceCandidate",
                  conversationId,
                  user._id,
                  e.candidate
                );
              }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", user._id, offer);
          }
        });

        socket.on("offer", async (user, offer) => {
          if (!peers.has(user._id)) {
            const pc = new RTCPeerConnection({ iceServers });
            peers.set(user._id, {
              user,
              connection: pc,
              stream: null,
              audioEnabled: false,
              videoEnabled: false,
            });

            localStream
              .getTracks()
              .forEach((track) => pc.addTrack(track, localStream));

            pc.ontrack = (e) => {
              peers.set(user._id, {
                user,
                connection: pc,
                stream: e.streams[0],
                audioEnabled: e.streams[0].getAudioTracks().length !== 0,
                videoEnabled: e.streams[0].getVideoTracks().length !== 0,
              });
              onUpdateRemoteMedias(Array.from(peers.values()));
            };

            pc.onicecandidate = (e) => {
              if (e.candidate) {
                socket.emit(
                  "iceCandidate",
                  conversationId,
                  user._id,
                  e.candidate
                );
              }
            };

            try {
              await pc.setRemoteDescription(new RTCSessionDescription(offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socket.emit("answer", user._id, answer);
            } catch (error) {
              console.error("Failed to set remote description:", error);
            }
          }
        });

        socket.on("answer", async (id, answer) => {
          const pc = peers.get(id);
          if (pc) {
            try {
              await pc.connection.setRemoteDescription(
                new RTCSessionDescription(answer)
              );
            } catch (error) {
              console.error("Failed to set remote description:", error);
            }
          }
        });

        socket.on("iceCandidate", (id, candidate) => {
          const pc = peers.get(id);
          if (pc) {
            pc.connection
              .addIceCandidate(new RTCIceCandidate(candidate))
              .catch((error) => {
                console.error("Failed to add ice candidate:", error);
              });
          }
        });

        socket.on("toggleEnableVideo", (userId, isVideoEnabled) => {
          const peer = peers.get(userId);
          if (peer) {
            peer.videoEnabled = isVideoEnabled;
            peers.set(userId, peer);
            onUpdateRemoteMedias(Array.from(peers.values()));
          }
        });

        socket.on("toggleEnableAudio", (userId, isAudioEnabled) => {
          const peer = peers.get(userId);
          if (peer) {
            peer.audioEnabled = isAudioEnabled;
            peers.set(userId, peer);
            onUpdateRemoteMedias(Array.from(peers.values()));
          }
        });

        socket.on("participantLeft", (id) => {
          const pc = peers.get(id);
          if (pc) {
            pc.connection.close();
            peers.delete(id);
            onUpdateRemoteMedias(Array.from(peers.values()));
          }
        });

        socket.on("fullCall", onFullCall);
      } catch (error) {
        console.error("Error joining call:", error);
      }
    },
    [
      conversationId,
      callType,
      localStreamRef,
      localVideoRef,
      onUpdateRemoteMedias,
      onFullCall,
    ]
  );

  const toggleEnableVideo = async ({
    socket,
    enableVideo,
  }: {
    socket: Socket;
    enableVideo: boolean;
  }) => {
    if (!localStreamRef.current) return;

    try {
      const currentVideoTracks = localStreamRef.current.getVideoTracks();

      if (enableVideo && currentVideoTracks.length === 0) {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        videoStream.getTracks().forEach((track) => {
          localStreamRef.current?.addTrack(track);
        });

        peers.forEach(async (peer) => {
          if (!localStreamRef.current) return;

          const newVideoTrack = videoStream.getVideoTracks()[0];
          if (newVideoTrack) {
            peer.connection.addTrack(newVideoTrack, localStreamRef.current);
            const offer = await peer.connection.createOffer();
            await peer.connection.setLocalDescription(offer);
            socket.emit("videoOffer", peer.user._id, offer);
          }
        });
      } else {
        currentVideoTracks.forEach((track) => (track.enabled = !enableVideo));
      }
      socket.emit("toggleEnableVideo", conversationId, !enableVideo);
    } catch (error) {
      console.error("Error toggling video:", error);
    }
  };

  const toggleEnableAudio = ({
    socket,
    enableAudio,
  }: {
    socket: Socket;
    enableAudio: boolean;
  }) => {
    socket.emit("toggleEnableAudio", conversationId, !enableAudio);

    if (localStreamRef.current) {
      localStreamRef.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = !enableAudio));
    }
  };

  const cleanup = (socket: Socket | null) => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    socket?.off("newParticipant");
    socket?.off("offer");
    socket?.off("answer");
    socket?.off("iceCandidate");
    socket?.off("participantLeft");
    socket?.off("fullCall");
    socket?.off("videoOffer");
    socket?.off("videoAnswer");
    socket?.off("toggleEnableVideo");
    socket?.off("toggleEnableAudio");
    socket?.emit("leaveCall", conversationId);
  };

  return { joinCall, toggleEnableVideo, toggleEnableAudio, cleanup };
};

export default useJoinCall;
