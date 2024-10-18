import {useState} from 'react';
import { Calendar, ConfigProvider} from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import ruRU from 'antd/es/locale/ru_RU';
import ModalCalendar from "./ModalCalendar";
import {useDispatch, useSelector} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";

import { dateCellRender, useBirthdayMap, useDeadlineMap, useMeetingMap} from "./calendar.helper";
import CustomHeader from "./CustomHeader";

dayjs.locale('ru');



const CustomCalendar = ({ dataBirthDay, dataMeeting, refetchMeeting, dataDeadline, colorMeeting , setFilterDate }) => {
    const [value, setValue] = useState(() => dayjs());
    const [filterForColor, setFilterForColor] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: { user } } = useSelector(state => state.auth);
    const roles =user?.roles[0]?.role.name
    const {systemMode}=useSelector(state => state.theme)

    const dispatch = useDispatch();
    const changeMeeting = (e, id) => {
        e.stopPropagation();
        dispatch(editIdQuery(id));
        if (roles === 'admin') {
            setIsModalOpen(true);
        }
    }

    const birthdayMap = useBirthdayMap(dataBirthDay)
    const meetingMap = useMeetingMap(dataMeeting)
    const deadlineMap = useDeadlineMap(dataDeadline)

    function onSelect  (newValue,info)  {

        if (roles !== 'staff' && roles !== 'boss' ) {
            const isPastDate = newValue.isBefore(dayjs(), 'day');
            if (!isPastDate &&info.source==='date') {
                setValue(newValue);
                setIsModalOpen(true);
            }
        }
    };


    return (
        <ConfigProvider locale={ruRU}>
            <Calendar
                headerRender={({ value, onChange }) => (
                    <CustomHeader setFilterForColor={setFilterForColor} filterForColor={filterForColor}
                                  colorMeeting={colorMeeting} value={value} setFilterDate={setFilterDate} onChange={onChange} />
                )}

                fullCellRender={(value)=>dateCellRender(
                    value,
                    birthdayMap,
                    meetingMap,
                    deadlineMap,
                    filterForColor,
                    colorMeeting,
                    changeMeeting,
                    systemMode
                )}
                onSelect={onSelect}
            />
            <ModalCalendar
                refetchMeeting={refetchMeeting}
                date={value}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </ConfigProvider>
    );
};

export default CustomCalendar;

