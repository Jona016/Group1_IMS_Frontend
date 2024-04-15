  import React from "react";
  import { useState, useEffect } from "react";
  import { makeStyles } from "@material-ui/core/styles";
  import Paper from "@material-ui/core/Paper";
  import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
  import List from "@material-ui/core/List";
  import { list, remove} from "./api-user.js";
  import { Link } from "react-router-dom";
  import ListItem from "@material-ui/core/ListItem";
  import ListItemAvatar from "@material-ui/core/ListItemAvatar";
  import ListItemText from "@material-ui/core/ListItemText";
  import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
  import IconButton from "@material-ui/core/IconButton";
  import Avatar from "@material-ui/core/Avatar";
  import Typography from "@material-ui/core/Typography";
  import ArrowForward from "@material-ui/icons/ArrowForward";
  import auth from '../lib/auth-helper.js'
import EditIncident from "../incidents/EditIncident.jsx";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: 0,
      margin: "0", 
      background: "#1bb1d6", 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    paper: {
      width: '100%',
      maxWidth: 800,
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.spacing(1),
      boxShadow: theme.shadows[5],
      marginTop: "70px",
    }
  }));

  export default function Users() {
    const [users, setUsers] = useState([]);
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
      const fetchData = async () =>{
          try {
              const jwt = auth.isAuthenticated();
              const admin = auth.isAdmin();
              const data = await list({userId: jwt.user._id, t: jwt.token})
              if (data.error){
                  setRedirectToSignin(true)
              } else{
                  setUsers(data);
              }
          } catch (error){
              console.error(error)
          }
      }

      fetchData();
      return() => {

      }

      // const abortController = new AbortController();
      // const signal = abortController.signal;
      // list(signal).then((data) => {
      //   if (data && data.error) {
      //     console.log(data.error);
      //   } else {
      //     setUsers(data);
      //   }
      // });
      // return function cleanup() {
      //   abortController.abort();
      // };
    }, []);


    const deleteUser = async (user) => {
      try {
        const jwt = auth.isAuthenticated();
        const data = await remove(
          { userId: userToDelete._id }, { t: jwt.token });
        if (data.error) {
          console.error(data.error);
        } else {
          const updatedUsers = user.filter(
            (item) => item._id !== userToDelete._id
          );
          setUsers(updatedUsers);
          setUserToDelete(null);
          setDialogOpen(false);
  
        }
      } catch (error) {
        console.error(error);
      }
    };

    const classes = useStyles();
    return (
      <div className={classes.root}>
      <Paper className={classes.paper} elevation={4} style={{ marginTop: "70px" }}>
        <Typography variant="h6">All Users</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date Created</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                {/* <TableCell>Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(item.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  {/* <TableCell>
                    <IconButton
                    arial-label="delete"
                    color="secondary"
                    onClick={() => {setUserToDelete(item);
                    setDialogOpen(true);}}
                    >
                      <DeleteIcon />
                      </IconButton>
                    <Link
                    aria-label="edit"
                    color="primary"
                     component={Link} 
                     to={"/admin/users/" + item._id}>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    </Link>
                                        
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteUser} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>      
      </div>
    );
  }
