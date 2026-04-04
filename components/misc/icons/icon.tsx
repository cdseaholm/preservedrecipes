'use client'

import { ThemeIcon, Tooltip } from "@mantine/core"
import { IconCircleCheck, IconCircleDashed, IconCircleX } from "@tabler/icons-react"

export function OpenIcon({ tooltip }: { tooltip?: string }) {
    const icon = (
        <ThemeIcon color="blue" size={24} radius="xl">
            <IconCircleDashed size={16} />
        </ThemeIcon>
    );

    if (tooltip) {
        return (
            <Tooltip label={tooltip} withArrow position="right">
                <span style={{ display: 'inline-flex' }}>{icon}</span>
            </Tooltip>
        );
    }

    return icon;
}

export function ErrIcon({ tooltip }: { tooltip?: string }) {
    const icon = (
        <ThemeIcon color="red" size={24} radius="xl">
            <IconCircleX size={16} />
        </ThemeIcon>
    );

    if (tooltip) {
        return (
            <Tooltip label={tooltip} withArrow position="right">
                <span style={{ display: 'inline-flex' }}>{icon}</span>
            </Tooltip>
        );
    }

    return icon;
}

export function CheckIcon({ tooltip }: { tooltip?: string }) {
    const icon = (
        <ThemeIcon color="green" size={24} radius="xl">
            <IconCircleCheck size={16} />
        </ThemeIcon>
    );

    if (tooltip) {
        return (
            <Tooltip label={tooltip} withArrow position="right">
                <span style={{ display: 'inline-flex' }}>{icon}</span>
            </Tooltip>
        );
    }

    return icon;
}

export function NoChangesIcon({ tooltip }: { tooltip?: string }) {
    const icon = (
        <ThemeIcon color="gray" size={24} radius="xl">
            <IconCircleDashed size={16} />
        </ThemeIcon>
    );
    if (tooltip) {
        return (
            <Tooltip label={tooltip} withArrow position="right">
                <span style={{ display: 'inline-flex' }}>{icon}</span>
            </Tooltip>
        );
    }
    return icon;
}
