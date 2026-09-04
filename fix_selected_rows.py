import re

with open("src/app/pages/Dashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '? "bg-[var(--state-error)]/10 border-[var(--state-error)]" : `border-transparent',
    '? "bg-[var(--state-error)]/15 border-transparent" : `border-transparent'
)
content = content.replace(
    '? "bg-[var(--primary)]/10 border-[var(--primary)]" : `border-transparent',
    '? "bg-[var(--primary)]/15 border-transparent" : `border-transparent'
)
content = content.replace(
    '? "bg-[var(--state-info)]/10 border-[var(--state-info)]" : `border-transparent',
    '? "bg-[var(--state-info)]/15 border-transparent" : `border-transparent'
)
content = content.replace(
    '? "bg-[var(--state-success)]/10 border-[var(--state-success)]" : `border-transparent',
    '? "bg-[var(--state-success)]/15 border-transparent" : `border-transparent'
)

with open("src/app/pages/Dashboard.tsx", "w") as f:
    f.write(content)
