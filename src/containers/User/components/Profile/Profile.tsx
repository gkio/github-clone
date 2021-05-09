import React from 'react';

interface IProfileProps {
  user: {
    avatar_url: string;
    login: string;
    name: string;
    bio: string;
    followers: number;
    following: number;
    public_repos: number;
  };
}

const Profile = ({ user }: IProfileProps) => {
  return (
    <>
      <div className="d-flex flex-items-center flex-justify-center">
        <img
          className="avatar avatar-8 mr-2"
          src={user.avatar_url}
          alt={`${user.login} profile`}
        />
        <div className="d-inline-block ">
          <div className="h1 d-inline-block ">{user.name}</div>
          <span className="text-italic ml-2">@{user.login}</span>
          <p>{user.bio}</p>
        </div>
      </div>
      <div className="d-flex flex-items-center">
        <div className="ml-4">
          followers: <span className="text-bold">{user.followers}</span>
        </div>
        <div className="ml-4">
          following: <span className="text-bold">{user.following}</span>
        </div>
        <div className="ml-4">
          public repos: <span className="text-bold">{user.public_repos}</span>
        </div>
      </div>
    </>
  );
};

export default Profile;
