import {
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  Button,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import useProfile from "../hooks/useProfile";
import { useEffect, useState } from "react";
import useUpdateProfilePicture from "../hooks/useUpdateProfilePicture";
import useDeleteProfilePicture from "../hooks/useDeleteProfilePicture";
import { useQueryClient } from "@tanstack/react-query";
import { MdDeleteOutline, MdDone } from "react-icons/md";
import { PiPencil } from "react-icons/pi";
import { toast } from "react-toastify";

const UpdateProfilePicture = () => {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const [selectedPicture, setSelectedPicture] = useState<{
    file: null | File;
    url: null | string;
  }>({ file: null, url: null });

  const [showDeletePictureDialog, setShowDeletePictureDialog] = useState(false);

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
    maxSize: 1 * 1024 * 1024,
    onDropRejected: () => {
      toast.info("Please select a valid file (Max size = 1mo)");
    },
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
    <>
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
                onClick={() => setShowDeletePictureDialog(true)}
              >
                <MdDeleteOutline size={20} />
              </IconButton>
            </Tooltip>
          )}
          <input {...getInputProps()} />
        </Stack>
      </Stack>
      <Dialog open={showDeletePictureDialog}>
        <Stack spacing={2} padding={2}>
          <Typography>
            Are you sure want to delete you profile picture?
          </Typography>
          <Stack direction="row" justifyContent="end" spacing={1}>
            <Button onClick={() => setShowDeletePictureDialog(false)}>
              Cancel
            </Button>
            <Button
              color="error"
              onClick={() => {
                deleteProfilePicture({});
                setShowDeletePictureDialog(false);
              }}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default UpdateProfilePicture;
