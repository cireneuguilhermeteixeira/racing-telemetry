import React from 'react';
import { Path, Text as SvgText } from 'react-native-svg';

import {
    ARC_RADIUS,
    CENTER_X,
    CENTER_Y,
    LABEL_RADIUS,
    MAX_RPM_VALUE,
} from '../../../utils';



const ArcSegmentsAndLabels = ({ rpm }: { rpm: number }) => {

    const totalSegments = 30;
    const activeSegments = Math.round((rpm / MAX_RPM_VALUE) * totalSegments);


    const arcSegments = Array.from({ length: totalSegments }).map((_, i) => {
        const angleStep = 180 / totalSegments;
        const startAngle = -180 + i * angleStep;
        const endAngle = startAngle + angleStep;
        const r = ARC_RADIUS;
        const x1 = CENTER_X + r * Math.cos((Math.PI * startAngle) / 180);
        const y1 = CENTER_Y + r * Math.sin((Math.PI * startAngle) / 180);
        const x2 = CENTER_X + r * Math.cos((Math.PI * endAngle) / 180);
        const y2 = CENTER_Y + r * Math.sin((Math.PI * endAngle) / 180);

        let color = '#222';
        if (i < activeSegments) {
            const ratio = i / totalSegments;
            if (ratio > 0.9) {
                color = '#a30000';
            } else if (ratio > 0.8) {
                color = '#8B0000';
            } else if (ratio > 0.6) {
                color = '#003E7E';
            } else if (ratio > 0.4) {
                color = '#0050A0';
            } else if (ratio > 0.2) {
                color = '#0066CC';
            } else {
                color = '#003366';
            }
        }

        return (
            <Path
                key={i}
                d={`M${x1},${y1} L${x2},${y2}`}
                stroke={color}
                strokeWidth={6}
                fill="none"
            />
        );
    });

    const arcLabels = Array.from({ length: 9 }).flatMap((_, i) => {
        const rpmValue = i * 1000;
        const angle = (-180 + (i * 180) / 8) * (Math.PI / 180);
        const r = LABEL_RADIUS;
        const x = CENTER_X + r * Math.cos(angle);
        const y = CENTER_Y + r * Math.sin(angle);

        const elements = [
            <SvgText
                key={`label-${i}`}
                x={x}
                y={y}
                fill="white"
                fontSize={12}
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
            >
                {rpmValue / 1000}
            </SvgText>
        ];

        if (i === 4) {
            elements.push(
                <SvgText
                    key="label-unit"
                    x={x}
                    y={y + 20}
                    fill="white"
                    fontSize={10}
                    fontWeight="normal"
                    textAnchor="middle"
                    alignmentBaseline="hanging"
                >
                    x1000r/min
                </SvgText>
            );
        }

        return elements;
    });

    return <>
        {arcSegments}
        {arcLabels}
    </>
}


export default ArcSegmentsAndLabels;
