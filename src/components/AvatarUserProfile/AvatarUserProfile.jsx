import {Avatar,  Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {ProfileHoverActive} from "../index";

const AvatarUserProfile = ({ full_name , moduls  , image , key ,messenger1 ,messenger2}) => {
  return (
      <Tooltip
          key={key}
          title={
            <ProfileHoverActive messenger1={messenger1} messenger2={messenger2} moduls={moduls} full_name={full_name} />
          }
          placement="top"
      >
        <Avatar
            icon={
              image ? (
                  <img
                      src={image}
                      alt={full_name}
                  />
              ) : (
                  <UserOutlined />
              )
            }
        />
      </Tooltip>
  );
};

export default AvatarUserProfile
