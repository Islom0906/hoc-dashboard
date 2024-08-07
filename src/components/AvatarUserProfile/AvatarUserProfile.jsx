import {Avatar,  Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {ProfileHoverActive} from "../index";

const AvatarUserProfile = ({ full_name , moduls  , image , key ,messenger1 ,messenger2 ,size}) => {
  return (
      <Tooltip
          key={key}
          title={
            <ProfileHoverActive messenger1={messenger1} messenger2={messenger2} moduls={moduls} full_name={full_name} />
          }
          placement="top"
      >
        <Avatar
            size={size}
            icon={
              image ? (
                  <img
                      src={image}
                      alt={full_name}
                      style={{width:'100%' , height:'100%' , objectFit:"contain"}}
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
