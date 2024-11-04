import { Card, Flex, Tag } from "antd";
import { AvatarUserProfile } from "../index";
import { IoMdArrowDropright } from "react-icons/io";
import dayjs from "dayjs";

// Define color mapping for status states
const statusColors = {
    Done: "green",
    Progress: "orange",
    Checking: "blue",
};

const HistoryCard = ({ history, isVertical }) => {
    const fromStatusColor = statusColors[history?.from_status] || "default";
    const toStatusColor = statusColors[history?.to_status] || "default";

    return (
        <Card size={"small"} key={history?.id}>
            <Flex vertical={isVertical} justify={"space-between"} align={"start"} gap={5}>
                <AvatarUserProfile
                    key={history?.user?.id}
                    full_name={history?.user?.full_name}
                    moduls={history?.user?.roles[0].position}
                    image={history?.user?.image}
                />
                <Flex vertical={true} gap={5} justify={"center"} align={"center"}>
                    <Flex gap={2} align={"center"}>
                        <Tag style={{ fontSize: 11, backgroundColor: fromStatusColor }}>
                            {history?.from_status}
                        </Tag>
                        <IoMdArrowDropright />
                        <Tag style={{ fontSize: 11, backgroundColor: toStatusColor }}>
                            {history?.to_status}
                        </Tag>
                    </Flex>
                    <Flex>
                        <Tag style={{ fontSize: 9 }}>
                            {dayjs(history?.created_at).format("DD/MM/YYYY HH:mm")}
                        </Tag>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};

export default HistoryCard;
