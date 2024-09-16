import {Avatar,  Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {ProfileHoverActive} from "../index";

const AvatarUserProfile = ({ full_name , moduls  , image , key ,size ,company}) => {
  return (
      <Tooltip
          key={key}
          title={
            <ProfileHoverActive  moduls={moduls} full_name={full_name} company={company} />
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
