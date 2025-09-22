export const LoginPage = {
  display: "flex",
  width: "100%",
  minHeight: "100vh",
  "@media (max-width: 991px)": { flexDirection: "column-reverse",justifyContent:'start',gap:"20px" },
  "@media (max-width: 600px)": { padding:"10px 0px 20px 0px" },
};
export const LoginPageLeft = {
  width: "50%",
  padding: "50px 100px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  "& h2": {
    fontFamily: "SemiBold_M",
    color: "var(--text-primary)",
    fontSize: "40px",
  },
  "& p": {
    fontFamily: "Regular_M",
    color: "var(--text-secondary)",
  },
  "@media (max-width: 991px)": { width: "80%",padding:"0px",margin:"auto" },
  "@media (max-width: 400px)": { width: "85%", },
};
export const LoginLogo = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "10px",
  "& svg": {
    width: "40px",
    height: "40px",
    background: "var(--primary)",
    padding: "9px",
    borderRadius: "6px",
    color: "var(--white)",
  },
  "& h3": {
    fontSize: "25px",
    color: "var(--white)",
    fontFamily: "Medium_M",
  },
};
export const LoginPageRight = {
  width: "50%",
  position: "relative",
  margin: "10px",
  borderRadius: "10px",
  "& h4": {
    color: "var(--text-secondary-dark)",
    fontSize: "16px",
    fontFamily: "Regular_M",
    textAlign: "center",
  },
    "@media (max-width: 991px)": {   display:"none",},
    "@media (max-width: 600px)": {   display:"unset",margin:"20px auto 0px auto",width:"90%",height:"10%"},
};
export const imageBottom = {
  width: "70%",
  position: "absolute",
  left: "0px",
  bottom: "0px",
  rotate: "180deg",
};
export const imageTop = {
  width: "70%",
  position: "absolute",
  right: "0px",
  top: "0px",
};
export const LoginPagebottomText = {
  color: "var(--text-secondary) !important",
  fontSize: "14px",
  mt: "10px !important",
  "& span": {
    color: "var(--primary)",
    cursor: "pointer",
  },
};
