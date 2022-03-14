import { data } from "jquery";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const GDHDatepickerTime = (props) => {
    useEffect(() => {
        // 브라우저 API를 이용하여 문서 타이틀을 업데이트합니다.
        setStartDate(new Date(props.value));
      }, [props.value]);
    const [startDate, setStartDate] = useState(new Date(props.value));
    const [interVals, setInterVals] = useState(props.interVals);

    const years = range(2015, getYear(new Date()) + 10, 1);
    const months = [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
        // "February",
        // "March",
        // "April",
        // "May",
        // "June",
        // "July",
        // "August",
        // "September",
        // "October",
        // "November",
        // "December"
    ];
    return (
        <DatePicker readOnly={props.readOnly}
            className="form-control form-control-sm"
            dateFormat="yyyy-MM-dd"
            renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled
            }) => (
                    <div
                        style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            {"<"}
                        </button>
                        <select
                            value={getYear(date)}
                            onChange={({ target: { value } }) => changeYear(value)}
                        >
                            {years.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            value={months[getMonth(date)]}
                            onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                            }
                        >
                            {months.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            {">"}
                        </button>
                    </div>
                )}
            selected={startDate}
            onChange={date => {
                setStartDate(date);
                props.onDateChange(props.name, date);
            }}
            showTimeSelect
            showTimeSelectOnly
            timeFormat="HH:mm"
            timeIntervals={interVals === undefined ? 10 : interVals}
            timeCaption="time"
            dateFormat="HH:mm"
        />
    );
};

export default GDHDatepickerTime;