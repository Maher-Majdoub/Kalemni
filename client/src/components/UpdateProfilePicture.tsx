import { Stack, Avatar, IconButton, Tooltip } from "@mui/material";
import { useDropzone } from "react-dropzone";
import useProfile from "../hooks/useProfile";
import { useEffect, useState } from "react";
import useUpdateProfilePicture from "../hooks/useUpdateProfilePicture";
import useDeleteProfilePicture from "../hooks/useDeleteProfilePicture";
import { useQueryClient } from "@tanstack/react-query";
import { MdDeleteOutline, MdDone } from "react-icons/md";
import { PiPencil } from "react-icons/pi";

const UpdateProfilePicture = () => {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const [selectedPicture, setSelectedPicture] = useState<{
    file: null | File;
    url: null | string;
  }>({ file: null, url: null });

  const {
    updateProfilePicture,
    isUpdateProfilePicutrePending,
    isUpdateProfilePicutreSuccess,
  } = useUpdateProfilePicture(queryClient);

  const { deleteProfilePicture, isDeleteProfilePicturePending } =
    useDeleteProfilePicture(queryClient);

  const { getInputProps, open } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDropAccepted: (files) => {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedPicture({ file: file, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    },
  });

  const submit = () => {
    if (!selectedPicture.file) return;
    const data = new FormData();
    data.append("picture", selectedPicture.file);
    updateProfilePicture(data);
  };

  useEffect(() => {
    if (isUpdateProfilePicutreSuccess)
      setSelectedPicture({ file: null, url: null });
  }, [isUpdateProfilePicutreSuccess]);

  return (
    <Stack alignItems="center">
      <Avatar
        src={
          selectedPicture.url ? selectedPicture.url : profile?.profilePicture
        }
        sx={{ width: 140, height: 140 }}
      />
      <Stack spacing={1} direction="row">
        <Tooltip title="Change Picture">
          <IconButton size="small" color="primary" onClick={open}>
            <PiPencil />
          </IconButton>
        </Tooltip>
        {selectedPicture.file && (
          <Tooltip title="Update Picture">
            <IconButton
              size="small"
              color="success"
              disabled={isUpdateProfilePicutrePending}
              onClick={submit}
            >
              <MdDone />
            </IconButton>
          </Tooltip>
        )}
        {profile?.profilePicture && (
          <Tooltip title="Delete picture">
            <IconButton
              size="small"
              color="error"
              disabled={isDeleteProfilePicturePending}
              onClick={deleteProfilePicture}
            >
              <MdDeleteOutline size={20} />
            </IconButton>
          </Tooltip>
        )}
        <input {...getInputProps()} />
      </Stack>
    </Stack>
  );
};

export default UpdateProfilePicture;
