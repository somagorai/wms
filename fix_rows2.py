import re

with open("src/app/pages/Dashboard.tsx", "r") as f:
    content = f.read()

# I will replace the hardcoded "border-transparent hover:border-..." with a V6 aware hover
# The selected state currently uses a border. Should the selected state use a border?
# A solid background is usually better for selected states if borders are disliked.
# Let's change the selected state to just a solid bg tint.

# Warning
content = content.replace(
    '? "border-[var(--state-error)] bg-[var(--state-error)]/10" : "border-transparent hover:border-[var(--state-error)]/40 dark:hover:border-[var(--state-error)]"',
    '? "bg-[var(--state-error)]/10 border-[var(--state-error)]" : `border-transparent ${isV6 ? "hover:bg-[var(--surface-container-high)] hover:border-transparent" : "hover:border-[var(--state-error)]/40 dark:hover:border-[var(--state-error)]"}`'
)

# In Progress
content = content.replace(
    '? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-transparent hover:border-[var(--primary)]/40 dark:hover:border-[var(--primary)]"',
    '? "bg-[var(--primary)]/10 border-[var(--primary)]" : `border-transparent ${isV6 ? "hover:bg-[var(--surface-container-high)] hover:border-transparent" : "hover:border-[var(--primary)]/40 dark:hover:border-[var(--primary)]"}`'
)

# Queued
content = content.replace(
    '? "border-[var(--state-info)] bg-[var(--state-info)]/10" : "border-transparent hover:border-[var(--state-info)]/40 dark:hover:border-[var(--state-info)]"',
    '? "bg-[var(--state-info)]/10 border-[var(--state-info)]" : `border-transparent ${isV6 ? "hover:bg-[var(--surface-container-high)] hover:border-transparent" : "hover:border-[var(--state-info)]/40 dark:hover:border-[var(--state-info)]"}`'
)

# Completed
content = content.replace(
    '? "border-[var(--state-success)] bg-[var(--state-success)]/10" : "border-transparent hover:border-[var(--state-success)]/40 dark:hover:border-[var(--state-success)]"',
    '? "bg-[var(--state-success)]/10 border-[var(--state-success)]" : `border-transparent ${isV6 ? "hover:bg-[var(--surface-container-high)] hover:border-transparent" : "hover:border-[var(--state-success)]/40 dark:hover:border-[var(--state-success)]"}`'
)

with open("src/app/pages/Dashboard.tsx", "w") as f:
    f.write(content)
