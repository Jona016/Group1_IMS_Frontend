import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import { Navigate, Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import auth from '../lib/auth-helper.js';
import { list, listByUser, remove } from './api-incident.js';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    margin: "0", 
    background: "#1bb1d6", 
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    // marginTop: "70px"
    alignItems: "center",
    // justifyContent: "center",
  },
  paper: {
    width: '100%',
    maxWidth: 1500, // Adjust the maximum width of the paper here
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[5],
    marginTop: "70px",
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em',
  },
  addButton: {
    float: 'right',
  },
  leftIcon: {
    marginRight: '8px',
  },
}));

export default function MyIncidents() {
  const classes = useStyles();
  const [incidents, setIncidents] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt = auth.isAuthenticated();
        const admin = auth.isAdmin();
        let data;
        if (!admin) {
          data = await listByUser({ userId: jwt.user._id, t: jwt.token });
        } else {
          data = await list({ t: jwt.token });
        }
        if (data.error) {
          setRedirectToSignin(true);
        } else {
          setIncidents(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      // Cleanup
    };
  }, []);

  const deleteIncident = async (incident) => {
    try {
      const jwt = auth.isAuthenticated();
      const data = await remove(
        { incidentId: incident._id },
        { t: jwt.token }
      );
      if (data.error) {
        console.error(data.error);
      } else {
        const updatedIncidents = incidents.filter(
          (item) => item._id !== incident._id
        );
        setIncidents(updatedIncidents);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (redirectToSignin) {
    const admin = auth.isAdmin;
    if (!admin) {
      return <Navigate to="/incidents" />;
    } else {
      return <Navigate to="/admin/incidents" />;
    }
  }

  return (
    <div className={classes.root}>
      <Paper elevation={4} className={classes.paper}>
        <Typography type="title" className={classes.title}>
          Your Incidents
          <span className={classes.addButton}>
            <Link to={auth.isAdmin() ? `/admin/incidents/new` : `/incidents/new`}>
              <Button color="primary" variant="contained">
                <AddIcon className={classes.leftIcon} /> New Incident
              </Button>
            </Link>
          </span>
        </Typography>

        <TableContainer>
          <Table aria-label="incidents table">
            <TableHead>
              <TableRow>
                <TableCell>Date Created</TableCell>
                <TableCell>Incident Number</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(incident.dateCreated).toDateString()}</TableCell>
                  <TableCell>{incident._id}</TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>{incident.description}</TableCell>
                  <TableCell>{incident.category}</TableCell>
                  <TableCell>{incident.severity}</TableCell>
                  <TableCell>{incident.comments}</TableCell>
                  <TableCell>{incident.status}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      onClick={() => deleteIncident(incident)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      color="primary"
                      component={Link}
                      to={auth.isAdmin() ? `/admin/incidents` : `/incidents`}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <List dense>
          {incidents.map((incident, i) => (
            <span key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar>
                    <Icon>info</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={incident.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {incident.category} | {incident.severity}
                      </Typography>
                      <br />
                      {incident.description}
                    </React.Fragment>
                  }
                />
                  {auth.isAuthenticated().user && (
                    <ListItemSecondaryAction>
                      {((auth.isAdmin() ||
                        incident.reportedBy ===
                          auth.isAuthenticated().user._id) && (
                        <IconButton
                          aria-label="Delete"
                          color="secondary"
                          onClick={() => deleteIncident(incident)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ))}
                      {((auth.isAdmin() && (
                        <Link to={`/admin/incidents/edit/${incident._id}`}>
                          <IconButton aria-label="Edit" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      )) || (
                        <Link to={`/incidents/edit/${incident._id}`}>
                          <IconButton aria-label="Edit" color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      ))}
                    </ListItemSecondaryAction>
                  )}
              </ListItem>
              <Divider />
            </span>
          ))}
        </List> */}
      </Paper>
    </div>
  );
}
