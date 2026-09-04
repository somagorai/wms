with open("src/app/pages/HealthDashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--primary)_18%,transparent)] hover:border-[var(--primary)]/50" : "hover:border-[var(--state-success)]',
    'hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--state-success)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--state-success)_18%,transparent)] hover:border-[var(--state-success)]/50" : "hover:border-[var(--state-success)]'
)
content = content.replace(
    'hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--primary)_18%,transparent)] hover:border-[var(--primary)]/50" : "hover:border-[var(--state-warning)]',
    'hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--state-warning)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--state-warning)_18%,transparent)] hover:border-[var(--state-warning)]/50" : "hover:border-[var(--state-warning)]'
)
content = content.replace(
    'hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--primary)_18%,transparent)] hover:border-[var(--primary)]/50" : "hover:border-[var(--state-error)]',
    'hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--state-error)_40%,transparent),0_0_18px_color-mix(in_srgb,var(--state-error)_18%,transparent)] hover:border-[var(--state-error)]/50" : "hover:border-[var(--state-error)]'
)

with open("src/app/pages/HealthDashboard.tsx", "w") as f:
    f.write(content)
