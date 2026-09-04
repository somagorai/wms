import re

with open("src/app/pages/Dashboard.tsx", "r") as f:
    content = f.read()

# Warning worklist
content = re.sub(
    r'className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-\[var\(--state-error\)\]/40 dark:hover:border-\[var\(--state-error\)\]"(\s*)onClick=\{\(\) => handleCellClick\(item\.type, "Warning", "worklist", item\.warning\)\}',
    r'className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border ${showDetailPanel && detailPanelType === item.type && detailPanelStatus === "Warning" && detailPanelSection === "worklist" ? "border-[var(--state-error)] bg-[var(--state-error)]/10" : "border-transparent hover:border-[var(--state-error)]/40 dark:hover:border-[var(--state-error)]"}`}\1onClick={() => handleCellClick(item.type, "Warning", "worklist", item.warning)}',
    content
)

# In Progress worklist
content = re.sub(
    r'className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-\[var\(--state-info\)\]/30 dark:hover:border-\[var\(--state-info\)\]"(\s*)onClick=\{\(\) => handleCellClick\(item\.type, "In Progress", "worklist", item\.inProgress\)\}',
    r'className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border ${showDetailPanel && detailPanelType === item.type && detailPanelStatus === "In Progress" && detailPanelSection === "worklist" ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-transparent hover:border-[var(--primary)]/40 dark:hover:border-[var(--primary)]"}`}\1onClick={() => handleCellClick(item.type, "In Progress", "worklist", item.inProgress)}',
    content
)

# Queued worklist
content = re.sub(
    r'className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-\[var\(--state-info\)\]/40 dark:hover:border-\[var\(--state-info\)\]"(\s*)onClick=\{\(\) => handleCellClick\(item\.type, "Queued", "worklist", item\.queued\)\}',
    r'className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border ${showDetailPanel && detailPanelType === item.type && detailPanelStatus === "Queued" && detailPanelSection === "worklist" ? "border-[var(--state-info)] bg-[var(--state-info)]/10" : "border-transparent hover:border-[var(--state-info)]/40 dark:hover:border-[var(--state-info)]"}`}\1onClick={() => handleCellClick(item.type, "Queued", "worklist", item.queued)}',
    content
)

# Completed worklist
content = re.sub(
    r'className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-\[var\(--state-success\)\]/40 dark:hover:border-\[var\(--state-success\)\]"(\s*)onClick=\{\(\) => handleCellClick\(item\.type, "Completed", "worklist", item\.completed\)\}',
    r'className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border ${showDetailPanel && detailPanelType === item.type && detailPanelStatus === "Completed" && detailPanelSection === "worklist" ? "border-[var(--state-success)] bg-[var(--state-success)]/10" : "border-transparent hover:border-[var(--state-success)]/40 dark:hover:border-[var(--state-success)]"}`}\1onClick={() => handleCellClick(item.type, "Completed", "worklist", item.completed)}',
    content
)

# Warning operations
content = re.sub(
    r'className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-\[var\(--state-error\)\]/40 dark:hover:border-\[var\(--state-error\)\]"(\s*)onClick=\{\(\) => handleCellClick\(item\.type, "Warning", "operations", item\.warning\)\}',
    r'className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border ${showDetailPanel && detailPanelType === item.type && detailPanelStatus === "Warning" && detailPanelSection === "operations" ? "border-[var(--state-error)] bg-[var(--state-error)]/10" : "border-transparent hover:border-[var(--state-error)]/40 dark:hover:border-[var(--state-error)]"}`}\1onClick={() => handleCellClick(item.type, "Warning", "operations", item.warning)}',
    content
)

# In Progress operations
content = re.sub(
    r'className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-\[var\(--state-info\)\]/30 dark:hover:border-\[var\(--state-info\)\]"(\s*)onClick=\{\(\) => handleCellClick\(item\.type, "In Progress", "operations", item\.inProgress\)\}',
    r'className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border ${showDetailPanel && detailPanelType === item.type && detailPanelStatus === "In Progress" && detailPanelSection === "operations" ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-transparent hover:border-[var(--primary)]/40 dark:hover:border-[var(--primary)]"}`}\1onClick={() => handleCellClick(item.type, "In Progress", "operations", item.inProgress)}',
    content
)

# Queued operations
content = re.sub(
    r'className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-\[var\(--state-info\)\]/40 dark:hover:border-\[var\(--state-info\)\]"(\s*)onClick=\{\(\) => handleCellClick\(item\.type, "Queued", "operations", item\.queued\)\}',
    r'className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border ${showDetailPanel && detailPanelType === item.type && detailPanelStatus === "Queued" && detailPanelSection === "operations" ? "border-[var(--state-info)] bg-[var(--state-info)]/10" : "border-transparent hover:border-[var(--state-info)]/40 dark:hover:border-[var(--state-info)]"}`}\1onClick={() => handleCellClick(item.type, "Queued", "operations", item.queued)}',
    content
)

# Completed operations
content = re.sub(
    r'className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-\[var\(--state-success\)\]/40 dark:hover:border-\[var\(--state-success\)\]"(\s*)onClick=\{\(\) => handleCellClick\(item\.type, "Completed", "operations", item\.completed\)\}',
    r'className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 border ${showDetailPanel && detailPanelType === item.type && detailPanelStatus === "Completed" && detailPanelSection === "operations" ? "border-[var(--state-success)] bg-[var(--state-success)]/10" : "border-transparent hover:border-[var(--state-success)]/40 dark:hover:border-[var(--state-success)]"}`}\1onClick={() => handleCellClick(item.type, "Completed", "operations", item.completed)}',
    content
)

with open("src/app/pages/Dashboard.tsx", "w") as f:
    f.write(content)
