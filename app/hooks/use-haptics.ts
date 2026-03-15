"use client";

import { useWebHaptics } from "web-haptics/react";

export function useHaptics() {
    const { trigger } = useWebHaptics();

    return {
        /** Two quick taps — action succeeded (copy, download, processing complete) */
        success: () => trigger("success"),
        /** Strong tap + soft tap — button press, selection change, navigation */
        nudge: () => trigger("nudge"),
        /** Three sharp taps — validation error, processing failure */
        error: () => trigger("error"),
        /** Raw trigger for custom patterns */
        trigger,
    };
}
