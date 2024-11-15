'use client'

import React, { useState, useEffect } from 'react';

const formatCountdown = (endTime) => {
    const currentTime = new Date().getTime();
    const timeLeft = new Date(endTime).getTime() - currentTime;

    if (timeLeft <= 0) return 'Time\'s up';

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return `${minutes} min ${seconds} sec`;
};

const CountdownGoal = ({ goal }) => {
    const [countdown, setCountdown] = useState(formatCountdown(goal.endTime));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(formatCountdown(goal.endTime));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [goal.endTime]);

    return <td className="px-4 py-2 w-[12%]">{countdown}</td>;
};

// Default export
export default CountdownGoal;