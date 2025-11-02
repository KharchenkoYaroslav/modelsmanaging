import React from 'react';
//import axios, { AxiosError } from 'axios';
import './_profile.scss';
import { IoClose } from 'react-icons/io5';
// import { MdEdit } from 'react-icons/md';
// import { MdOutlinePassword } from 'react-icons/md';

interface ProfileProps {
  onLogout: () => void;
  username: string | null;
  isProfileOpen: boolean;
  handleProfileToggle: () => void;
}

const Profile: React.FC<ProfileProps> = ({onLogout, username, isProfileOpen, handleProfileToggle}) => {
  // const [error, setError] = useState<string | null>(null);

  // const handleChangeLogin = async (
  //   newLogin: string,
  //   token: string,
  //   setLogin: (login: string) => void
  // ) => {
  //   setError(null);
  //   try {
  //     await axios.patch(
  //       `${import.meta.env.VITE_API_URL}/auth/change-login`,
  //       {
  //         newLogin: newLogin,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert('Login changed successfully!');
  //     setLogin(newLogin);
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       const axiosError = err as AxiosError<{ message: string }>;
  //       if (axiosError.response) {
  //         setError(
  //           `Login change failed: ${
  //             axiosError.response.data.message || 'Bad request'
  //           } (Status: ${axiosError.response.status})`
  //         );
  //       } else if (axiosError.request) {
  //         setError('Login change failed: No response from server.');
  //       } else {
  //         setError('Login change failed: An error occurred.');
  //       }
  //     } else if (err instanceof Error) {
  //       setError(err.message);
  //     }
  //   }
  // };

  // const handleChangePassword = async (currentPassword: string, newPassword: string, token: string) => {
  //   setError(null);
  //   try {
  //     await axios.patch(
  //       `${import.meta.env.VITE_API_URL}/auth/change-password`,
  //       {
  //         currentPassword: currentPassword,
  //         newPassword: newPassword,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert('Password changed successfully!');
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       const axiosError = err as AxiosError<{ message: string }>;
  //       if (axiosError.response) {
  //         setError(
  //           `Password change failed: ${
  //             axiosError.response.data.message || 'Bad request'
  //           } (Status: ${axiosError.response.status})`
  //         );
  //       } else if (axiosError.request) {
  //         setError('Password change failed: No response from server.');
  //       } else {
  //         setError('Password change failed: An error occurred.');
  //       }
  //     } else if (err instanceof Error) {
  //       setError(err.message);
  //     }
  //   }
  // };

  // const handleDeleteAccount = async (token: string) => {
  //   setError(null);
  //   try {
  //     await axios.delete(
  //       `${import.meta.env.VITE_API_URL}/auth/delete-account`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert('Account deleted successfully!');
  //     setToken(null);
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       const axiosError = err as AxiosError<{ message: string }>;
  //       if (axiosError.response) {
  //         setError(
  //           `Account deletion failed: ${
  //             axiosError.response.data.message || 'Bad request'
  //           } (Status: ${axiosError.response.status})`
  //         );
  //       } else if (axiosError.request) {
  //         setError('Account deletion failed: No response from server.');
  //       } else {
  //         setError('Account deletion failed: An error occurred.');
  //       }
  //     } else if (err instanceof Error) {
  //       setError(err.message);
  //     }
  //   }
  // };

  return (
    <div
      className={`profile ${isProfileOpen ? '' : 'hidden'}`}
    >
      <div className="profileContent">
        <IoClose className="close" onClick={handleProfileToggle} />
        <p>
          <strong>Username:</strong>&nbsp;{username}
        </p>

        <button
          className="redButton"
          onClick={() => {
            onLogout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
