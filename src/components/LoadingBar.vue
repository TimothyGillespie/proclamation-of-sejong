<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    progress: number; // 0 to 1 representing the day cycle
}>();

// Day Constants
const DAWN = 0.2; // 5-6 AM approx
const DUSK = 0.8; // 7-8 PM approx

// Computed: Is the shadow visible?
const shadowOpacity = computed(() => {
    if (props.progress < DAWN || props.progress > DUSK) return 0;
    
    // Smooth fade in/out
    const fadeRange = 0.05;
    if (props.progress < DAWN + fadeRange) {
        return (props.progress - DAWN) / fadeRange;
    }
    if (props.progress > DUSK - fadeRange) {
        return (DUSK - props.progress) / fadeRange;
    }
    return 1;
});

// Computed: Shadow Position Logic (Angbuilgu Projection)
const shadowTransform = computed(() => {
    // 1. Calculate Sun Position
    // Map daylight time (DAWN to DUSK) to -90deg (East) to +90deg (West) azimuth?
    // Actually:
    // 6 AM: Sun East (-90), Shadow West (+90 relative to North? No, shadow points West).
    // Wait, if Sun is East, Shadow is West.
    // Let's use standard clock angles where 0 is North/Up (12 o'clock).
    // 6 AM (Sun East/Right): Shadow points West/Left (-90deg).
    // 12 PM (Sun South/Down in Northern Hemisphere): Shadow points North/Up (0deg).
    // 6 PM (Sun West/Left): Shadow points East/Right (+90deg).
    
    // Normalize progress to -1 (Dawn) to 0 (Noon) to 1 (Dusk)
    const mid = (DAWN + DUSK) / 2; // 0.5
    const range = (DUSK - DAWN) / 2; // 0.3
    const normalizedTime = (props.progress - mid) / range; // -1 to 1 during daylight
    
    // Rotation: -90deg to +90deg
    const rotateDeg = normalizedTime * 90;
    
    // Length:
    // Shadow is longest at sunrise/sunset (reaching the rim).
    // Shadow is shortest at noon (closest to center).
    // Let's simulate a curve. 
    // At 0 (Noon), length is minimal (e.g., 20px).
    // At 1/-1 (Horizon), length is maximal (e.g., 50px - rim radius).
    // Parabolic or Sinusoidal approximation for shadow length on the bowl surface.
    // L = Min + (Max - Min) * t^2 is a decent approximation for a bowl projection.
    
    const minLen = 15; // Closest to gnomon (Winter noon is far, Summer noon is close. Average.)
    const maxLen = 45; // Rim
    const currentLen = minLen + (maxLen - minLen) * Math.pow(Math.abs(normalizedTime), 2.5); // Power > 1 makes it stay short longer around noon
    
    return `rotate(${rotateDeg}deg) translateY(-${currentLen}px)`; 
    // Negative Y because 0deg is Up/North, and we rotate the container.
    // Actually, if we rotate the container:
    // 0deg: translateY(-len) moves it Up. Correct.
    // -90deg: rotates Left, translate moves it Left. Correct.
});

// Helper for SVG grid generation
const hourLines = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75]; // degrees
</script>

<template>
    <div class="sundial-wrapper">
        <div class="angbuilgu">
            <!-- SVG Grid representing the concave bowl markings -->
            <svg class="bowl-grid" viewBox="-50 -50 100 100">
                <defs>
                    <clipPath id="bowl-clip">
                        <circle r="48" cx="0" cy="0" />
                    </clipPath>
                </defs>
                
                <!-- Background -->
                <circle r="49" fill="#e0e0e0" />
                <circle r="49" fill="url(#concave-gradient)" />
                <radialGradient id="concave-gradient">
                    <stop offset="70%" stop-color="#fff" stop-opacity="0" />
                    <stop offset="100%" stop-color="#000" stop-opacity="0.2" />
                </radialGradient>

                <g clip-path="url(#bowl-clip)">
                    <!-- Vertical Hour Lines (Meridians) -->
                    <!-- They radiate from the north pole (invisible bottom?) -->
                    <!-- Simplified as straight lines for visual clarity at this scale -->
                    <line 
                        v-for="deg in hourLines" 
                        :key="'h'+deg"
                        x1="0" y1="0" 
                        x2="0" y2="-60" 
                        stroke="#9e9e9e" 
                        stroke-width="0.5"
                        :transform="`rotate(${deg}) translate(0, 10)`" 
                    />
                    <!-- The translate(0,10) pushes the convergence point down, faking the pole projection -->

                    <!-- Horizontal Season Lines (Solar Terms) -->
                    <!-- Curves perpendicular to hour lines -->
                    <path d="M-45,-15 Q0,-25 45,-15" fill="none" stroke="#9e9e9e" stroke-width="0.5" /> <!-- Summer (Inner) -->
                    <path d="M-48,-28 Q0,-38 48,-28" fill="none" stroke="#9e9e9e" stroke-width="0.5" /> <!-- Equinox -->
                    <path d="M-45,-40 Q0,-50 45,-40" fill="none" stroke="#9e9e9e" stroke-width="0.5" /> <!-- Winter (Outer) -->
                </g>
                
                <!-- Kanji Markers -->
                <g class="labels" font-family="serif" font-size="8" text-anchor="middle" fill="#424242" font-weight="bold">
                    <text x="0" y="-38">午</text> <!-- Noon -->
                    <text x="-35" y="-12" transform="rotate(-60)">卯</text> <!-- ~6AM -->
                    <text x="35" y="-12" transform="rotate(60)">酉</text> <!-- ~6PM -->
                </g>
            </svg>

            <!-- The Gnomon (Pointer) -->
            <div class="gnomon-base"></div>
            <div class="gnomon-point"></div>
            
            <!-- The Shadow (Projected Tip) -->
            <div 
                class="shadow-container"
                :style="{ transform: shadowTransform }"
            >
                <div class="shadow-tip" :style="{ opacity: shadowOpacity }"></div>
            </div>
        </div>
        <div class="label">Angbuilgu</div>
    </div>
</template>

<style scoped lang="scss">
.sundial-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
}

.angbuilgu {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    position: relative;
    border: 4px solid #5d4037; /* Bronze/Wood rim */
    background-color: #f5f5f5;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.bowl-grid {
    width: 100%;
    height: 100%;
    display: block;
}

/* Gnomon: The spike in the center */
.gnomon-base {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background-color: #3e2723;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

.gnomon-point {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 20px solid #3e2723;
    transform: translate(-50%, -100%); /* Pointing Up/North physically */
    z-index: 9;
    /* Actually angbuilgu gnomon points to the celestial pole (North).
       In top-down view, it's a spike pointing towards the 'Noon' line (North).
    */
}

/* Shadow Logic */
.shadow-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    /* The transform rotates this container and pushes it out */
    z-index: 5;
    transition: transform 0.1s linear; /* Smooth movement */
}

.shadow-tip {
    position: absolute;
    top: -3px;
    left: -3px;
    width: 6px;
    height: 6px;
    background-color: rgba(0,0,0,0.7);
    border-radius: 50%;
    filter: blur(1.5px);
    transition: opacity 0.5s ease;
}

.label {
    margin-top: 8px;
    font-size: 0.75rem;
    font-family: var(--font-serif);
    color: var(--ink-primary);
    background-color: var(--bg-paper);
    padding: 2px 8px;
    border: 1px solid #d7ccc8;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
