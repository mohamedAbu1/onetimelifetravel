"use client";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function MobileHeaderAuth() {
  const isMobile = useMediaQuery("(max-width:1023px)");
  const { userData, loginWithGoogle, logout } = useAuth();
  const { t } = useTranslation("common");
  const [anchorEl, setAnchorEl] = useState(null);

  if (!isMobile) return null;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

 
  return (
    <div>
      {!userData ? (
        <IconButton onClick={loginWithGoogle} style={{ borderRadius: "15px" }}>
          <FcGoogle size={28} />
        </IconButton>
      ) : (
        <>
          <IconButton onClick={handleOpenMenu}>
            <Avatar
              src={userData?.avatar_url || userData?.image || "/default-avatar.png"}
              alt={userData?.name}
            />
          </IconButton>

          {/* ✅ Popup menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={async () => { handleCloseMenu(); await logout(); }}>{t("logout")}</MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}
