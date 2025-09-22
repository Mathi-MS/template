import { Box, Typography, Button } from "@mui/material";
import { images } from "../assets/Images/Images";
import CustomButton from "../Custom/CustomButton";

const Timeout = () => {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "#/";
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--secondary)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 2,
      }}
    >
      <Box
        component="img"
        src={images.timeouGif}
        sx={{ width: "250px", marginBottom: 4 }}
        alt="Timeout"
      />

      <Typography variant="h4" sx={{ fontWeight: "bold", color:"var(--title)", opacity:".7" }}>
        408 Request Timed Out
      </Typography>

      <Typography variant="body1" sx={{ m: "10px 0px 20px 0px !important",maxWidth: 400 ,fontWeight:"bold",color:"var(--primary)",fontSize:"14px" }}>
        The server took too long to respond. Please check your internet connection or try again later.
      </Typography>

      <CustomButton
        variant="contained"
        onClick={goBack}
        label="Go Back Home"
        type="button"
        boxSx={{ width: "fit-content" }}
      />
        
    </Box>
  );
};

export default Timeout;
