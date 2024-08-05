import { Flex} from "antd";
import {FaRegUserCircle} from "react-icons/fa";
import {VscFileSubmodule} from "react-icons/vsc";
import {IoMdLink} from "react-icons/io";

 const ProfileHoverActive = ({ full_name , moduls , messenger1 , messenger2 }) => {

  return (
      <Flex vertical={true} gap={5} >
        {
          full_name &&
            <Flex gap={5} align={'center'}>
              <FaRegUserCircle />
              <p>{full_name}</p>
            </Flex>
        }
        {
          moduls &&
            <Flex gap={2} align={'center'}>
              <VscFileSubmodule />
              <p>{moduls}</p>
            </Flex>
        }
        {
            messenger1 &&
            <Flex gap={2} align={'center'}>
              <IoMdLink  />
              <a href={messenger1} target={"_blank"}>{messenger1}</a>
            </Flex>
        }
        {
            messenger2 &&
            <Flex gap={2} align={'center'}>
              <IoMdLink  />
              <a href={messenger2} target={"_blank"}>{messenger2}</a>
            </Flex>
        }
      </Flex>
  );
};

 export default ProfileHoverActive
