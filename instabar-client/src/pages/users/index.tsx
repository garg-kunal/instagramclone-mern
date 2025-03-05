import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Appbar from "../../components/appbar";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { fetcher } from "../../services/fetcher";
import { RootState } from "../../store";
import { toast } from "react-toastify";

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const userState = useSelector((state: RootState) => state.auth.user);

  const fetchUsers = () => {
    fetcher("/user/all", "GET")
      .then((res: any) => setUsers(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const sendRequest = (to: string) => {
    const data = {
      name: userState.name,
      image: userState.image,
      to: to,
      from: userState.id,
    };
    fetcher("/user/send", "POST", data)
      .then((res: any) => {
        fetchUsers();
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Unable to send connection request.");
      });
  };

  return (
    <div className="w-full">
      <Appbar />
      <Typography variant="h4" align="center" sx={{ mt: 2, mb: 3 }}>
        Discover Users
      </Typography>
      {users.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
          No New Users
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {users.map((item: any, key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Card sx={{ maxWidth: 345, mx: "auto" }}>
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
                    minHeight: "250px",
                    maxHeight: "250px",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.body}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, backgroundColor: "#000" }}
                    onClick={() => sendRequest(item._id)}
                  >
                    Connect
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

export default GetUsers;
