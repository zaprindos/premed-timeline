# Pre-Med Timeline — Version 16

This is the first working prototype of the interactive pre-med journey website.

## Included
- One continuous vertical timeline
- Months on the left
- Recurring monthly goal categories
- Hover-preview branches that retract automatically
- Click-to-pin branches open
- More organic curved connectors
- Expandable main targets and subtargets
- Checkable bite-sized tasks
- Automatic completion percentages
- Local browser persistence using `localStorage`
- Responsive mobile layout
- Three sample months: August–October 2026

## Run locally

1. Install Node.js (LTS)
2. Open a terminal in this folder
3. Run:

```bash
npm install
npm run dev
```

Vite will print a local URL such as `http://localhost:5173`.

## Next versions
- Add November 2026–May 2027
- Carry-over / overdue tasks
- Better year-color sections
- Notes and deadlines
- Supabase login + cloud sync
- Parent viewer role
- GitHub/Vercel deployment


## Version 3 changes
- Subtargets now branch horizontally outward from main targets
- Third-level tasks continue outward instead of dropping down
- Left-side and right-side branches mirror each other
- Hover still retracts automatically; click still pins open

## Version 5 changes
- Reverted the extra straight shared trunk from Version 4
- Removed duplicate secondary connector lines
- Second-level branches now use smooth SVG Bézier curves
- Curves fan directly from each main target toward its subtargets
- Retains retract-on-hover and click-to-pin behavior

## Version 6 changes
- Branch curves now draw outward from the main target
- Subtargets fade in after their branch reaches them
- Multiple subtargets appear in a short staggered sequence
- Deeper task leaves also animate outward
- Existing hover retract and click-to-pin behavior retained

## Version 7 changes
- Peripheral task branches now use the same smooth Bézier style as main branches
- Peripheral curves draw outward with the same growing animation
- Hovering a subtarget reveals its task branch
- Moving the cursor onto the revealed tasks keeps the branch open
- The peripheral branch retracts only after leaving the whole subtarget/task branch
- Click-to-pin behavior remains available


## Version 8 changes
- Added Edit Roadmap mode
- + button beside each month adds a new main target
- + button on each main target adds a subtarget
- + button on each subtarget adds a bite-size task
- Trash icons remove targets, subtargets, and individual tasks
- New target modal supports title, description, and left/right branch side
- Timeline structure is saved to localStorage, so edits survive refreshes
- Progress storage remains separate from roadmap structure


## Version 9 changes
- Primary targets now clearly expose + and trash controls on hover
- Secondary branch + / trash controls disappear as soon as that subtarget is no longer hovered
- Peripheral task trash icons are also contextual
- Edit controls no longer clutter the branch tree when not actively editing that node
- Mobile/touch keeps edit controls visible because hover is unavailable


## Version 10 changes
- Ctrl+Z undoes the most recent roadmap edit
- Cmd+Z also works on macOS
- Supports up to 50 structural undo steps per session
- Undo covers adding/removing primary targets, subtargets, and tasks
- Ctrl+Z inside a text field retains normal text-editing undo behavior


## Version 11 changes
- Pencil controls added to primary targets, subtargets, and individual tasks
- Rename existing targets without deleting them
- Edit primary target descriptions
- Move primary targets between left and right sides
- Ctrl+Z also undoes these edits


## Version 12 changes
- Peripheral branches no longer open just because a primary target was hovered
- Peripheral hover now starts only when the actual subtarget is hovered
- A short hover grace period lets you move from a subtarget into its peripheral tasks
- Months dynamically expand when new primary targets are added
- New August targets stay inside the August region instead of spilling into September


## Version 13 changes
- Each month now owns its own full-width background color band
- Month color height follows the actual dynamic month height
- Adding a new August primary target extends August's color downward
- September and later months are pushed down together with their colors
- Removed the old fixed-percentage page gradient


## Version 14 changes
- Academics is isolated into its own timeline view
- Added Pre-Med Timeline / Academic Timeline switcher
- Pre-Med Timeline hides academic primary branches
- Academic Timeline shows only academic primary branches
- Both timelines retain months, colors, branches, checkboxes, editing, and Ctrl+Z
- Adding a primary target while viewing Academic Timeline automatically classifies it as academic


## Version 15 changes
- Removed the small decorative circles from the timeline
- Removed month marker circles
- Removed primary branch connection circles
- Preserved the continuous vertical timeline and organic branch lines
- Preserved task checkboxes and editing controls


## Version 16 changes
- Removed the remaining square connection markers
- Preserved the central timeline and organic branch lines
- Preserved task checkboxes
