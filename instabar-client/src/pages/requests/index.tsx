import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { RootState } from "../../store";
import { toast } from "react-toastify";
import Appbar from "../../components/appbar";
import { fetcher } from "../../services/fetcher";

const Requests = () => {
  const userState = useSelector((state: RootState) => state.auth.user);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetcher(`/user/getrequest/${userState.id}`, "GET")
      .then((res: any) => {
        setRequests(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [userState.id]);

  const acceptRequest = (from: string) => {
    const data = {
      me: userState.id,
      followId: from,
    };
    fetcher(`/user/follow`, "POST", data)
      .then(() => {
        toast.success("Connected.");
        navigate("/account");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full">
      <Appbar />
      <Typography variant="h4" align="center" sx={{ mt: 2, mb: 3 }}>
        Friend Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
          No Requests
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {requests.map((item: any, key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Card sx={{ maxWidth: 345, mx: "auto", maxHeight: "360px" }}>
                <CardMedia
                  component="img"
                  height="250"
                  image={
                    item.image ||
                    "https://nutristyle.com/wp-content/uploads/2020/06/bio-photo-placeholder.png"
                  }
                  alt={item.name}
                  sx={{
                    objectFit: "cover",
                    maxHeight: "250px",
                    minHeight: "250px",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    From: <strong>{item.name}</strong>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ backgroundColor: "#000" }}
                    onClick={() => acceptRequest(item.from)}
                  >
                    Accept
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Requests;
