import re

with open("src/app/components/TopCard.tsx", "r") as f:
    content = f.read()

# Replace the hardcoded primary glow with status-based glow
old_v6glow = '''  const v6HoverGlow = isV6
    ? "hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--primary)_18%,transparent)] hover:border-[var(--primary)]/50"
    : "";'''

new_v6glow = '''  const v6GlowColor = status === "neutral" || status === "primary" ? "var(--primary)" : `var(--state-${status})`;
  
  const v6HoverGlow = isV6
    ? `hover:shadow-[0_0_0_1px_color-mix(in_srgb,${v6GlowColor}_40%,transparent),0_0_18px_color-mix(in_srgb,${v6GlowColor}_18%,transparent)] hover:border-[${v6GlowColor}]/50`
    : "";'''

content = content.replace(old_v6glow, new_v6glow)

with open("src/app/components/TopCard.tsx", "w") as f:
    f.write(content)

