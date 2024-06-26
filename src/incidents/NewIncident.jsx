import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { create as createIncident } from './api-incident.js';
import { Link, Navigate, useParams } from 'react-router-dom';
import auth from '../lib/auth-helper.js';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';



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
  card: {
    width: '100%',
    maxWidth: 500,
    margin: 'auto',
    textAlign: 'center',
    marginTop: "70px",
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: 'middle',
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: '1.2em',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

export default function NewIncident() {
  const params = useParams();
  const classes = useStyles();
  const [values, setValues] = useState({
    title: '',
    category: '',
    severity: '',
    description: '',
    comments: '',
    status: '',
    error: '',
    redirect: false,
  });
  const [errors, setErrors] = useState({
    title: '',
    category: '',
    severity: '',
    description: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };


  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!values.title) {
      newErrors.title = 'Title is required';
      valid = false;
    } else {
      newErrors.title = '';
    }

    if (!values.category) {
      newErrors.category = 'Category is required';
      valid = false;
    } else {
      newErrors.category = '';
    }

    if (!values.severity) {
      newErrors.severity = 'Severity is required';
      valid = false;
    } else {
      newErrors.severity = '';
    }

    if (!values.description) {
      newErrors.description = 'Description is required';
      valid = false;
    } else {
      newErrors.description = '';
    }

    setErrors(newErrors);
    return valid;
  };

  const clickSubmit = () => {
    const incidentData = {
      title: values.title,
      category: values.category,
      severity: values.severity,
      description: values.description,
    };

    createIncident(incidentData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: '', redirect: true });
        setShowConfirmation(true);
      }
      if (data) {
        setValues({
            title: '',
            category: '',
            severity: '',
            description: '',
            error: '',
            redirect: false,
          })
      }
    });
  };


  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            New Incident
          </Typography>
          <br />
          <TextField
            id="title"
            label="Title"
            className={classes.textField}
            value={values.title}
            onChange={handleChange('title')}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title}

          />
          <br />
          <TextField
            id="category"
            label="Category"
            className={classes.textField}
            value={values.category}
            onChange={handleChange('category')}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title}

          />
          <br />
          <TextField
            id="severity"
            label="Severity"
            className={classes.textField}
            value={values.severity}
            onChange={handleChange('severity')}
            margin="normal"
            error={!!errors.severity}
            helperText={errors.severity}

          />
          <br />
          <TextField
            id="description"
            label="Description"
            multiline
            value={values.description}
            onChange={handleChange('description')}
            className={classes.textField}
            margin="normal"
            error={!!errors.description}
            helperText={errors.description}

          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
          <Link to={auth.isAdmin() ? `/admin/incidents` : `/incidents`} className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <DialogTitle>Incident Created</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The incident has been created successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Link to={auth.isAdmin() ? `/admin/incidents` : `/incidents`}>
          <Button color="primary" onClick={() => setShowConfirmation(false)} autoFocus>
            OK
          </Button>
          </Link>
        </DialogActions>
      </Dialog>

    </div>
  );
}
