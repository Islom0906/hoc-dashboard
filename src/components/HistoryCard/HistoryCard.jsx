import { Card, Flex, Tag } from "antd";
import {AvatarUserProfile, StatusTag} from "../index";
import { IoMdArrowDropright } from "react-icons/io";
import dayjs from "dayjs";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import {translateStatus} from "../../helper/translate.status";
import DeadlineStatusColor from "../../hooks/deadlineStatusColor";

// Define color mapping for status states
const statusColors = {
    Done: "green",
    Progress: "orange",
    Checking: "blue",
};

const HistoryCard = ({ history, isVertical }) => {
    const fromStatusColor = statusColors[history?.from_status] || "default";
    const toStatusColor = statusColors[history?.to_status] || "default";
    const screens = useBreakpoint();
    return (
        <Card size={"small"} key={history?.id} className={'history-card'}>
            <Flex gap={5} vertical={true}>
                <Flex vertical={isVertical} justify={"space-between"} align={"start"} gap={5}>
                    <AvatarUserProfile
                        keyId={history?.user?.id}
                        full_name={history?.user?.full_name}
                        moduls={history?.user?.roles[0].position}
                        image={history?.user?.image}
                        size={screens.xl ? 30:screens.xs ? 20 : 25}
                    />
                    <Flex>
                        <Tag style={{ fontSize: 9 ,margin:0}}>
                            {dayjs(history?.created_at).format("DD/MM/YYYY HH:mm")}
                        </Tag>
                    </Flex>

                </Flex>
                <Flex vertical={true} gap={5} justify={"center"} align={"center"}>
                    <Flex gap={2} align={"center"}>
                        <StatusTag status={history?.from_status} text={history?.from_status}/>
                        <IoMdArrowDropright />
                        <StatusTag status={history?.to_status} text={history?.to_status}/>

                    </Flex>

                </Flex>
            </Flex>

        </Card>
    );
};

export default HistoryCard;
