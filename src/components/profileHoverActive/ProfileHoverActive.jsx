import { Flex} from "antd";
import {FaRegUserCircle} from "react-icons/fa";
import {VscFileSubmodule} from "react-icons/vsc";
import {IoMdLink} from "react-icons/io";
import {FaBuildingColumns} from "react-icons/fa6";

 const ProfileHoverActive = ({ full_name , moduls , company }) => {

  return (
      <Flex vertical={true} gap={5} >
        {
          full_name &&
            <Flex gap={5} align={'center'}>
              <FaRegUserCircle style={{flexShrink:0}} />
              <p style={{fontSize:12}}>{full_name}</p>
            </Flex>
        }
        {
          moduls &&
            <Flex gap={2} align={'center'}>
              <VscFileSubmodule style={{flexShrink:0}} />
              <p style={{fontSize:12}}>{moduls}</p>
            </Flex>
        }
        {
            company &&
            <Flex gap={2} align={'center'}>
              <FaBuildingColumns style={{flexShrink:0}} />
              <p style={{fontSize:12}}>{company}</p>
            </Flex>
        }

      </Flex>
  );
};

 export default ProfileHoverActive
