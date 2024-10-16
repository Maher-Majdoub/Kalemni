import { Badge, IconButton } from "@mui/material";
import { ReactNode } from "react";
import { CgClose } from "react-icons/cg";

interface Props {
  children: ReactNode;
  onRemove(): void;
}

const RemoveBadge = ({ children, onRemove }: Props) => (
  <Badge
    badgeContent={
      <IconButton
        color="error"
        size="small"
        children={<CgClose />}
        onClick={onRemove}
      />
    }
  >
    {children}
  </Badge>
);

export default RemoveBadge;
