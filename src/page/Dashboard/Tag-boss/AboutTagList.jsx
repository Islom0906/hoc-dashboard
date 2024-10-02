import {Flex, Progress, Table, Tooltip,Avatar} from "antd";
import React, {useEffect} from "react";
import AvatarUserProfile from "../../../components/AvatarUserProfile/AvatarUserProfile";
import {UserOutlined} from "@ant-design/icons";

const AboutTagList = ({data,setTagChartData}) => {

    const data1 = [
        {
            "id": 9,
            "name": "Hoc_ishchilari",
            "total_tasks_count": 10,
            "failed_tasks_count": 7,
            "done_tasks_count": 2,
            "in_progress_tasks_count": 1,
            "staffs": []
        },
        {
            "id": 7,
            "name": "Evolution Service",
            "total_tasks_count": 9,
            "failed_tasks_count": 4,
            "done_tasks_count": 5,
            "in_progress_tasks_count": 0,
            "staffs": []
        },
        {
            "id": 3,
            "name": "IT",
            "total_tasks_count": 15,
            "failed_tasks_count": 5,
            "done_tasks_count": 5,
            "in_progress_tasks_count": 5,
            "staffs": []
        },
        {
            "id": 6,
            "name": "Logistika",
            "total_tasks_count": 0,
            "failed_tasks_count": 0,
            "done_tasks_count": 0,
            "in_progress_tasks_count": 0,
            "staffs": []
        },
        {
            "id": 5,
            "name": "Sotuv",
            "total_tasks_count": 20,
            "failed_tasks_count": 0,
            "done_tasks_count": 18,
            "in_progress_tasks_count": 2,
            "staffs": []
        },
        {
            "id": 4,
            "name": "Bugalteriya",
            "total_tasks_count": 0,
            "failed_tasks_count": 0,
            "done_tasks_count": 0,
            "in_progress_tasks_count": 0,
            "staffs": []
        },

        {
            "id": 1,
            "name": "IT Bo'lim",
            "total_tasks_count": 7,
            "failed_tasks_count": 0,
            "done_tasks_count": 2,
            "in_progress_tasks_count": 5,
            "staffs": [
                {
                    "id": 2,
                    "full_name": "Bobur Berdiev Iskandar o'g'li",
                    "position": "Frontend dasturchi",
                    "email": "o.abduganiev@evms.uz",
                    "image": "http://95.46.96.95:82/media/images/2125c2db-1420-488f-be81-98987e045ffe.png"
                },
                {
                    "id": 3,
                    "full_name": "Ravshan Giyosov Ilyos o'g'li",
                    "position": "Backend dasturchi",
                    "email": "ravshangiyosov2002@gmail.com",
                    "image": "http://95.46.96.95:82/media/images/2125c2db-1420-488f-be81-98987e045ffe.png"
                },
                {
                    "id": 7,
                    "full_name": "Islom Abdug'ofurov Bahrom o'g'li",
                    "position": "Frontend dasturchi",
                    "email": "abdugofurovislom1@gmail.com",
                    "image": "http://95.46.96.95:82/media/images/f912f567-4741-4289-b48a-1a5928f4cbdb.jpg"
                },
                {
                    "id": 8,
                    "full_name": "Bobur Berdiev Iskandar o'g'li",
                    "position": "Manager",
                    "email": "b.berdiev@leapmotorca.uz",
                    "image": "http://95.46.96.95:82/media/images/197e24e1-a4d5-4660-bef1-ea3bf1e4e4f1.png"
                }
            ]
        }
    ]

    console.log(data)
    useEffect(() => {
        // setTagChartData({
        //     done_tasks_count:data1[0].done_tasks_count,
        //     failed_tasks_count:data1[0].failed_tasks_count,
        //     in_progress_tasks_count:data1[0].in_progress_tasks_count,
        // })
    }, [data1]);
    const calculateProgressData = (doneTasks, failedTasks, inProgressTasks, totalTasks) => {

        // Calculate percentage
        const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

        if (totalTasks === 0) {
            return {
                failedPercent: 0,
                donePercent: 0,
                inProgressPercent: 0,
                percent: 0
            };
        }

        const failedPercent = Math.round((failedTasks / totalTasks) * 100);
        const donePercent = Math.round((doneTasks / totalTasks) * 100);
        const inProgressPercent = Math.round((inProgressTasks / totalTasks) * 100);
        console.log({percent, failedPercent, donePercent, inProgressPercent})
        return {percent, failedPercent, donePercent, inProgressPercent};

    }

    const columns = [
        {
            title: 'Название компании',
            dataIndex: 'name',
            id: 'name',
            render: (text, record) => {
                const {percent, failedPercent, donePercent, inProgressPercent} = calculateProgressData(
                    record?.done_tasks_count,
                    record?.failed_tasks_count,
                    record?.in_progress_tasks_count,
                    record?.total_tasks_count
                );
                return (
                    <Flex align={'center'} gap={10}>
                        <Tooltip
                            title={`${record?.done_tasks_count} сделанный / ${record?.failed_tasks_count} неуспешный / ${record?.in_progress_tasks_count} прогресс`}>
                            <Progress
                                size={50}
                                type="circle"
                                percent={100}
                                format={() => `${percent}%`}
                                // steps={{
                                //     count: 3, // Number of steps (failed, done, in-progress)
                                //     gap: 2 // Gap between steps
                                // }}
                                strokeColor={{
                                    '0%': "#f04f47",  // Red for failed tasks (start)
                                    [`${failedPercent}%`]: '#f04f47',  // Stop at failed percent
                                    [`${failedPercent}%`]: '#11c15b',  // Transition to green for done tasks
                                    [`${failedPercent + donePercent}%`]: '#11c15b',  // Stop at done percent
                                    [`${failedPercent + donePercent}%`]: '#0a8fdc',  // Transition to blue for in-progress tasks
                                    [`${failedPercent + donePercent + inProgressPercent}%`]: '#0a8fdc',  // Stop at in-progress percent
                                }}


                            />

                        </Tooltip>

                        <p>{text}</p>
                    </Flex>
                )
            },
        },
        {
            title: 'Логотип тёмный',
            dataIndex: 'staffs',
            id: 'staffs',
            render: (avatar) => {
                return (
                    <Avatar.Group size={30} max={{
                        count: 2,

                        style: {

                            color: '#f56a00',
                            backgroundColor: '#fde3cf',
                        },
                    }}>
                        {
                            avatar?.length >0 ?
                            avatar?.map((staff) => (

                                <AvatarUserProfile key={staff?.id} size={30} full_name={staff?.full_name} image={staff?.image}/>
                            ))
                                :
                                <Avatar size={30} icon={<UserOutlined />} />
                        }

                    </Avatar.Group>
                )
            },
        },

    ];
    return <Table
        columns={columns}
        dataSource={data1}
        rowKey={(record) => record.id}
        title={() => 'Информация о компании'}
    />
};

export default AboutTagList;