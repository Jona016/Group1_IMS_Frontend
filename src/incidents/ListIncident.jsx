import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Navigate, Link } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import auth from '../lib/auth-helper.js';
import { list, listByUser, remove } from './api-incident.js';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { listId } from '../users/api-user.js';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    margin: '0',
    background: '#1bb1d6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    width: '100%',
    maxWidth: 1500,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[5],
    marginTop: '70px',
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState(null);


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
          const incidentsWithUserNames = await Promise.all(data.map(async incident => {
            try {
              const user = await listId(incident.reportedBy);
              return { ...incident, reporter: user.name };
            } catch (error) {
              console.error('Error decoding user:', error);
              return { ...incident, reporter: 'Unknown' };
            }
          }));
          setIncidents(incidentsWithUserNames);
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
      const jwt = auth.isAdmin();
      const data = await remove(
        // { incidentId: incident._id },
        { incidentId: incidentToDelete._id }, { t: jwt.token });
      if (data.error) {
        console.error(data.error);
      } else {
        const updatedIncidents = incidents.filter(
          // (item) => item._id !== incident._id
          (item) => item._id !== incidentToDelete._id
        );
        setIncidents(updatedIncidents);
        setIncidentToDelete(null);
        setDialogOpen(false);

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
            <Link
              to={auth.isAdmin() ? `/admin/incidents/new` : `/incidents/new`}
            >
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
                <TableCell style={{ width: '10%' }} >Date Created</TableCell>
                <TableCell>Incident Number</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Severity</TableCell>
                {/* <TableCell>Reporter</TableCell> */}
                <TableCell>Comments</TableCell>
                <TableCell>Status</TableCell>
                <TableCell style={{ width: '10%' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(incident.dateCreated).toDateString()}
                  </TableCell>
                  <TableCell>{incident._id}</TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>{incident.description}</TableCell>
                  <TableCell>{incident.category}</TableCell>
                  <TableCell>{incident.severity}</TableCell>
                  {/* <TableCell>{incident.reportedBy}</TableCell> */}
                  <TableCell>{incident.comments}</TableCell>
                  <TableCell>{incident.status}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      // onClick={() => deleteIncident(incident)}
                      onClick={() => {
                        setIncidentToDelete(incident);
                        setDialogOpen(true);}}

                    >
                      <DeleteIcon />
                    </IconButton>
                    {auth.isAdmin() ? (
                      <Link to={`/admin/incidents/edit/${incident._id}`}>
                        <IconButton aria-label="edit" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    ) : (
                      <Link to={`/incidents/edit/${incident._id}`}>
                        <IconButton aria-label="edit" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    )}
                  </TableCell>
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
            Are you sure you want to delete this incident?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteIncident} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}