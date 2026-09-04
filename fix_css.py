import re

with open("src/styles/theme-master-blue-v6.css", "r") as f:
    css = f.read()

old_css = """/* Card hover: subtle primary border + outer glow — all versions */
.group:has(> .absolute.left-0.top-1\/2.-translate-y-1\/2.w-1):hover {
  transform: none !important;
  border-color: color-mix(in srgb, var(--primary) 55%, transparent) !important;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--primary) 30%, transparent),
    0 0 16px 0px color-mix(in srgb, var(--primary) 18%, transparent) !important;
}"""

new_css = """/* Card hover: soft shadow only, no border changes */
.group:has(> .absolute.left-0.top-1\/2.-translate-y-1\/2.w-1):hover {
  transform: none !important;
  border-color: transparent !important;
  box-shadow: 0 0 15px color-mix(in srgb, var(--primary) 30%, transparent) !important;
}"""

css = css.replace(old_css, new_css)

with open("src/styles/theme-master-blue-v6.css", "w") as f:
    f.write(css)
