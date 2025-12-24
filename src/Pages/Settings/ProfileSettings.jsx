import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
  Card, 
  CardBody, 
  CardHeader,
  Badge,
  Alert,
  Spinner
} from 'reactstrap';
import { incrementProfileTrigger } from '../../store/profileMenu/actions';
import axiosInstance from '../../utils/axiosInstance';
import ChangePasswordModal from '../../Modal/ChangePasswordModal';
import { getRole } from '../../utils/roleUtils';
import { getCrmUserById } from '../../apiServices/service';
import { useDispatch } from 'react-redux';
import { validateEmail, validatePhone } from '../Utility/FormValidation';
import Breadcrumbs from '../../components/Common/Breadcrumb';

const ProfileSettings = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    mobile: '', 
    avatar: null, 
  });

  const [editMode, setEditMode] = useState({
    firstName: false,
    lastName: false,
    email: false,
    mobile: false,
  });

  const [preview, setPreview] = useState(null);

  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const role = authUser?.response?.role;
  const mainUsers = ['super_admin', 'client_admin', 'firm_admin', 'accountant', 'employee', 'blog_admin'];
  const crmUsers = ['ASM', 'Telecaller', 'SM'];

  const fetchUserData = async () => {
    try {
      if (!authUser || !role) return;
      setLoading(true);
      
      if (mainUsers.includes(role)) {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_URL}/auth/getAccount/${authUser?.response._id}`,
        );
        const userData = response;
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          mobile: userData.mobile || '',
          avatar: userData.avatar || null,
        });
        setPreview(userData.avatar);
      } else if (crmUsers.includes(role)) {
        const response = await getCrmUserById();
        const userData = response.data;
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          mobile: userData.mobile || '',
          avatar: userData.avatar || null,
        });
        setPreview(userData.avatar);
      }
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser && role) {
      fetchUserData();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setFormData({
        ...formData,
        avatar: file,
      });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const updatedData = new FormData();
    
    // Validate email
    if (formData.email && !validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      setUpdating(false);
      return;
    }
    
    // Validate mobile
    if (formData.mobile && !validatePhone(formData.mobile)) {
      toast.error('Please enter a valid mobile number');
      setUpdating(false);
      return;
    }

    if (crmUsers.includes(role)) {
      if (formData.firstName) updatedData.append('firstName', formData.firstName);
      if (formData.lastName) updatedData.append('lastName', formData.lastName);
      if (formData.email) updatedData.append('email', formData.email);
      if (formData.mobile) updatedData.append('mobile', formData.mobile);
    } else {
      updatedData.append('firstName', formData.firstName);
      updatedData.append('lastName', formData.lastName);
      updatedData.append('email', formData.email);
      updatedData.append('mobile', formData.mobile);
    }

    if (formData.avatar instanceof File) {
      updatedData.append('avatar', formData.avatar);
    }

    try {
      let response;
      if (mainUsers.includes(role)) {
        response = await axiosInstance.put(
          `${process.env.REACT_APP_URL}/auth/update/${authUser?.response._id}`,
          updatedData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else if (crmUsers.includes(role)) {
        response = await axiosInstance.put(
          `/crmuser/update-crmsuser/${authUser?.response._id}`,
          updatedData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      toast.success('Profile updated successfully!');
      setPreview(response.data?.avatar || preview);
      
      const updatedUser = {
        ...authUser,
        response: {
          ...authUser.response,
          avatar: response.avatar || authUser.response.avatar,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          mobile: response.mobile,
        },
      };

      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      dispatch(incrementProfileTrigger());
      
      // Reset edit modes
      setEditMode({
        firstName: false,
        lastName: false,
        email: false,
        mobile: false,
      });
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const toggleEditMode = (field) => {
    setEditMode({
      ...editMode,
      [field]: !editMode[field],
    });
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'super_admin': 'danger',
      'client_admin': 'primary',
      'firm_admin': 'info',
      'accountant': 'success',
      'employee': 'secondary',
      'blog_admin': 'warning',
      'ASM': 'primary',
      'Telecaller': 'info',
      'SM': 'success'
    };
    
    return (
      <Badge color={roleColors[role] || 'light'} className="px-2 py-1">
        {role?.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="text-center py-5">
          <Spinner color="primary" size="lg" />
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className='page-content'>
        <Breadcrumbs title="Account" breadcrumbItem="Profile Settings" />
        
        <Container fluid>
          <Row className="justify-content-center">
            {/* Profile Information Card */}
            <Col xl={6} lg={8} md={12}>
              <Card className="shadow-sm border-0">
                <CardHeader className="bg-light border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm rounded-circle bg-primary d-flex align-items-center justify-content-center me-3">
                        <i className="mdi mdi-account-outline text-white font-size-16"></i>
                      </div>
                      <div>
                        <h4 className="mb-1 text-primary">Profile Information</h4>
                        <p className="text-muted mb-0 small">Update your personal details</p>
                      </div>
                    </div>
                    {role && getRoleBadge(role)}
                  </div>
                </CardHeader>
                
                <CardBody className="p-4">
                  <Alert color="info" className="border-0 bg-light-info mb-4">
                    <i className="mdi mdi-information-outline me-2"></i>
                    <strong>Tip:</strong> Click the edit button next to each field to make changes.
                  </Alert>

                  <Form onSubmit={handleSubmit}>
                    {/* First Name */}
                    <FormGroup className="mb-4">
                      <Label className="form-label fw-semibold text-dark">
                        <i className="mdi mdi-account me-2"></i>First Name
                      </Label>
                      {editMode.firstName ? (
                        <div className="d-flex align-items-center gap-2">
                          <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            className="flex-grow-1"
                          />
                          <Button 
                            color="success" 
                            size="sm"
                            onClick={() => toggleEditMode('firstName')}
                            className="px-3"
                          >
                            <i className="mdi mdi-check me-1"></i>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                          <div className="d-flex align-items-center">
                            <span className="text-dark fw-medium">
                              {formData.firstName || 
                                <span className="text-muted fst-italic">No first name set</span>
                              }
                            </span>
                          </div>
                          <Button 
                            color="primary" 
                            size="sm" 
                            outline
                            onClick={() => toggleEditMode('firstName')}
                          >
                            <i className="mdi mdi-pencil me-1"></i>
                            Edit
                          </Button>
                        </div>
                      )}
                    </FormGroup>

                    {/* Last Name */}
                    <FormGroup className="mb-4">
                      <Label className="form-label fw-semibold text-dark">
                        <i className="mdi mdi-account me-2"></i>Last Name
                      </Label>
                      {editMode.lastName ? (
                        <div className="d-flex align-items-center gap-2">
                          <Input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            className="flex-grow-1"
                          />
                          <Button 
                            color="success" 
                            size="sm"
                            onClick={() => toggleEditMode('lastName')}
                            className="px-3"
                          >
                            <i className="mdi mdi-check me-1"></i>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                          <span className="text-dark fw-medium">
                            {formData.lastName || 
                              <span className="text-muted fst-italic">No last name set</span>
                            }
                          </span>
                          <Button 
                            color="primary" 
                            size="sm" 
                            outline
                            onClick={() => toggleEditMode('lastName')}
                          >
                            <i className="mdi mdi-pencil me-1"></i>
                            Edit
                          </Button>
                        </div>
                      )}
                    </FormGroup>

                    {/* Email */}
                    <FormGroup className="mb-4">
                      <Label className="form-label fw-semibold text-dark">
                        <i className="mdi mdi-email me-2"></i>Email Address
                      </Label>
                      {editMode.email ? (
                        <div className="d-flex align-items-center gap-2">
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="flex-grow-1"
                          />
                          <Button 
                            color="success" 
                            size="sm"
                            onClick={() => toggleEditMode('email')}
                            className="px-3"
                          >
                            <i className="mdi mdi-check me-1"></i>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                          <span className="text-dark fw-medium">
                            {formData.email || 
                              <span className="text-muted fst-italic">No email set</span>
                            }
                          </span>
                          <Button 
                            color="primary" 
                            size="sm" 
                            outline
                            onClick={() => toggleEditMode('email')}
                          >
                            <i className="mdi mdi-pencil me-1"></i>
                            Edit
                          </Button>
                        </div>
                      )}
                    </FormGroup>

                    {/* Mobile */}
                    <FormGroup className="mb-4">
                      <Label className="form-label fw-semibold text-dark">
                        <i className="mdi mdi-phone me-2"></i>Mobile Number
                      </Label>
                      {editMode.mobile ? (
                        <div className="d-flex align-items-center gap-2">
                          <Input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Enter your mobile number"
                            className="flex-grow-1"
                          />
                          <Button 
                            color="success" 
                            size="sm"
                            onClick={() => toggleEditMode('mobile')}
                            className="px-3"
                          >
                            <i className="mdi mdi-check me-1"></i>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                          <span className="text-dark fw-medium">
                            {formData.mobile || 
                              <span className="text-muted fst-italic">No mobile number set</span>
                            }
                          </span>
                          <Button 
                            color="primary" 
                            size="sm" 
                            outline
                            onClick={() => toggleEditMode('mobile')}
                          >
                            <i className="mdi mdi-pencil me-1"></i>
                            Edit
                          </Button>
                        </div>
                      )}
                    </FormGroup>

                    <div className="d-flex justify-content-between pt-3 border-top">
                      <Button 
                        color="primary" 
                        type="submit" 
                        className="px-4"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="mdi mdi-content-save-outline me-2"></i>
                            Update Profile
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        color="info" 
                        outline
                        onClick={toggleModal}
                        className="px-4"
                      >
                        <i className="mdi mdi-lock-outline me-2"></i>
                        Change Password
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            {/* Profile Picture Card */}
            <Col xl={6} lg={8} md={12}>
              <Card className="shadow-sm border-0">
                <CardHeader className="bg-light border-bottom">
                  <div className="d-flex align-items-center">
                    <div className="avatar-sm rounded-circle bg-success d-flex align-items-center justify-content-center me-3">
                      <i className="mdi mdi-camera-outline text-white font-size-16"></i>
                    </div>
                    <div>
                      <h4 className="mb-1 text-primary">Profile Picture</h4>
                      <p className="text-muted mb-0 small">Upload and manage your profile image</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardBody className="p-4">
                  <div className="text-center mb-4">
                    <div className="profile-img-container position-relative d-inline-block">
                      {preview ? (
                        <img 
                          src={preview} 
                          alt="Profile" 
                          className="rounded-circle border border-light shadow-sm" 
                          style={{ 
                            width: '150px', 
                            height: '150px',
                            objectFit: 'cover'
                          }} 
                        />
                      ) : (
                        <div 
                          className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                          style={{ width: '150px', height: '150px' }}
                        >
                          <i className="mdi mdi-account text-muted" style={{ fontSize: '4rem' }}></i>
                        </div>
                      )}
                      <div className="position-absolute bottom-0 end-0">
                        <Label 
                          for="avatar" 
                          className="btn btn-primary btn-sm rounded-circle p-2 mb-0"
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="mdi mdi-camera font-size-12"></i>
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-4">
                      <Label className="form-label fw-semibold text-dark mb-3">
                        <i className="mdi mdi-upload me-2"></i>
                        Choose Profile Picture
                      </Label>
                      
                      <Input
                        type="file"
                        name="avatar"
                        id="avatar"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="form-control"
                      />
                      
                      <div className="form-text mt-2">
                        <i className="mdi mdi-information-outline me-1"></i>
                        Supported formats: JPG, PNG, GIF. Max size: 5MB
                      </div>
                    </FormGroup>

                    {formData.avatar instanceof File && (
                      <Alert color="success" className="border-0 bg-light-success">
                        <i className="mdi mdi-check-circle me-2"></i>
                        New image selected. Click "Update Profile Picture" to save.
                      </Alert>
                    )}

                    <div className="text-center">
                      <Button 
                        color="success" 
                        type="submit" 
                        className="px-4"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="mdi mdi-cloud-upload-outline me-2"></i>
                            Update Profile Picture
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <ChangePasswordModal 
          role={role}
          mainUsers={mainUsers}
          crmUsers={crmUsers}
          isOpen={isModalOpen} 
          toggle={toggleModal} 
          authUser={authUser}
        />
      </div>

      <style jsx>{`
        .bg-light-info {
          background-color: rgba(58, 186, 244, 0.1) !important;
        }
        .bg-light-success {
          background-color: rgba(40, 167, 69, 0.1) !important;
        }
        .profile-img-container:hover .position-absolute {
          opacity: 1;
        }
        .form-label {
          font-weight: 600;
        }
        .avatar-sm {
          width: 2.5rem;
          height: 2.5rem;
        }
      `}</style>
    </React.Fragment>
  );
};

export default ProfileSettings;