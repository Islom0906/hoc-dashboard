import {Avatar,  Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {ProfileHoverActive} from "../index";

const AvatarUserProfile = ({ full_name , moduls  , image , keyId ,size ,company ,style}) => {

  return (
      <Tooltip
          key={keyId}
          title={
            <ProfileHoverActive  moduls={moduls} full_name={full_name} company={company} />
          }
          placement="top"
      >
        <Avatar
            style={{flexShrink:0 , style}}
            size={size}

            icon={
              image ? (
                  <img
                      src={image}
                      alt={full_name}
                      style={{width:'100%' , height:'100%' , objectFit:"contain",flexShrink:0}}
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
