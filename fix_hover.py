import re

# Fix TopCard.tsx
with open("src/app/components/TopCard.tsx", "r") as f:
    topcard = f.read()

# Replace the v6HoverGlow in TopCard
old_topcard_glow = '''  const v6HoverGlow = isV6
    ? `hover:shadow-[0_0_0_1px_color-mix(in_srgb,${v6GlowColor}_40%,transparent),0_0_18px_color-mix(in_srgb,${v6GlowColor}_18%,transparent)] hover:border-[${v6GlowColor}]/50`
    : "";'''

new_topcard_glow = '''  const v6HoverGlow = isV6
    ? "hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent"
    : "";'''

topcard = topcard.replace(old_topcard_glow, new_topcard_glow)

with open("src/app/components/TopCard.tsx", "w") as f:
    f.write(topcard)

# Fix Dashboard.tsx
with open("src/app/pages/Dashboard.tsx", "r") as f:
    dashboard = f.read()

# I used regex to change it previously. The pattern was:
# "hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--state-XXX)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--state-XXX)_18%,transparent)] hover:border-[var(--state-XXX)]/50"

import re
dashboard = re.sub(
    r'hover:shadow-\[0_0_0_1px_color-mix\(in_srgb,var\(--state-[^)]+\)_40%,transparent\),0_0_18px_color-mix\(in_srgb,var\(--state-[^)]+\)_18%,transparent\)\] hover:border-\[var\(--state-[^)]+\)\]/50',
    r'hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent',
    dashboard
)
dashboard = re.sub(
    r'hover:shadow-\[0_0_0_1px_color-mix\(in_srgb,var\(--primary\)_40%,transparent\),0_0_18px_color-mix\(in_srgb,var\(--primary\)_18%,transparent\)\] hover:border-\[var\(--primary\)\]/50',
    r'hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent',
    dashboard
)

with open("src/app/pages/Dashboard.tsx", "w") as f:
    f.write(dashboard)

# Fix HealthDashboard.tsx
with open("src/app/pages/HealthDashboard.tsx", "r") as f:
    health = f.read()

health = re.sub(
    r'hover:shadow-\[0_0_0_1px_color-mix\(in_srgb,var\(--state-[^)]+\)_40%,transparent\),0_0_18px_color-mix\(in_srgb,var\(--state-[^)]+\)_18%,transparent\)\] hover:border-\[var\(--state-[^)]+\)\]/50',
    r'hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent',
    health
)
health = re.sub(
    r'hover:shadow-\[0_0_0_1px_color-mix\(in_srgb,var\(--primary\)_40%,transparent\),0_0_18px_color-mix\(in_srgb,var\(--primary\)_18%,transparent\)\] hover:border-\[var\(--primary\)\]/50',
    r'hover:shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:border-transparent dark:hover:border-transparent',
    health
)

with open("src/app/pages/HealthDashboard.tsx", "w") as f:
    f.write(health)

print("Replaced all hover shadows.")
