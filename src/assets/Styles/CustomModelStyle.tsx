export const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 500,
  bgcolor: "background.paper",
  backgroundRepeat: "no-repeat",
  backgroundSize: "unset",
  backgroundPosition: "top left",
  borderRadius: 2,
  boxShadow: 24,
  padding: "10px 20px 20px 20px",
  outline: "none",
  "@media (max-width: 600px)": {
    minWidth: "90%",
    maxWidth: "90%",
  },
};
export const styleModalNew = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 800,
  bgcolor: "background.paper",
  // backgroundImage: `url(${back})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "unset",
  backgroundPosition: "top left",
  borderRadius: 2,
  boxShadow: 24,
  padding: "10px 20px 20px 20px",
  outline: "none",
  minWidth: "500px",
  "& form": {
    maxHeight: "50vh",
    overflowY: "auto",
    padding: "10px 0px 0px 0px",
  },
  "@media (max-width: 600px)": {
    minWidth: "90%",
    maxWidth: "90%",
  },
};
export const newStyleModel = {
  maxWidth: 200,
};

export const iconStyle = {
  // position: "absolute",
  // top: 8,
  // right: 8,
  "& svg": {
    width: "16px",
    height: "16px",
  },
};

export const questionStyle = {
  fontFamily: "Medium_M",
  fontSize: "14px",
};

export const btnStyleContainer = {
  display: "flex",
  gap: 2,
  mt: 2,
};

export const cancelStyle = {
  border: "1px solid var(--borderColor)",
  color: "var(--inputLabel)",
};

export const inputStyle = {
  width: "100%",
};
