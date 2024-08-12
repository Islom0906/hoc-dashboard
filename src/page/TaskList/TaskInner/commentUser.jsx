import {Flex, Tag, Typography} from "antd";
import {AvatarUserProfile} from "../../../components";
import dayjs from "dayjs";
import {CiLink} from "react-icons/ci";

const {Text} = Typography;
const CommentUser = ({comment}) => {
  const extractFilename = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  };


  return (
      <Flex align={"start"} justify={"space-between"} gap={15} style={{width: '100%',padding:'10px 5px',
          borderRadius:'5px'}}>
        <Flex   gap={10} style={{width: '100%' , direction:`${comment?.created_user?.name ==='Qudrat' ? 'rlv' : ''}`}}>
          <div style={{flexShrink:0 , display:'flex' , flexDirection:'column' , gap:10}}>
            <Text style={{flexShrink: 0, fontSize: '11px'}}
                  type="secondary">{dayjs(comment.created_at).format("DD.MM.YYYY hh:mm")}</Text>
            <div style={{width:40 , height:40}}>
          <AvatarUserProfile key={comment?.created_user?.id} full_name={comment?.created_user?.full_name} moduls={comment?.created_user?.position} image={comment?.created_user?.images.image} messenger2={comment?.created_user?.messenger_link2} messenger1={comment?.created_user?.messenger_link1} />

            </div>

          </div>
          <Flex vertical={true} gap={5}>
            <Text>{comment?.message}</Text>
            {
                comment?.file &&
                <Tag color={'blue'} icon={<CiLink />} style={{display:"flex" , alignItems:'center' , gap:5}}>
                <a href={comment?.file} download={true} target={"_blank"}>
                  {extractFilename(comment.file)}
                </a>
                </Tag>
            }
          </Flex>
        </Flex>
      </Flex>
  );
};

export default CommentUser
