import React, { useEffect } from 'react';
import { useMarker } from './Marker';
import { PopupProps } from '../types';

export const Popup: React.FC<PopupProps> = (props) => {
    const markerContext = useMarker();

    const lastOptions = React.useRef<string>('');

    useEffect(() => {
        if (!markerContext) return;

        let finalContent = props.content;
        if (!finalContent && typeof props.children === 'string') {
            finalContent = props.children;
        }

        const currentOptions = {
            content: finalContent,
            style: props.style,
            autoPan: props.autoPan,
            offset: props.offset
        };

        const optionsStr = JSON.stringify(currentOptions);
        if (optionsStr !== lastOptions.current) {
            lastOptions.current = optionsStr;
            markerContext.setPopupOptions(currentOptions);
        }
    }, [props.content, props.children, props.style, props.autoPan, props.offset, markerContext]);

    return null;
};
