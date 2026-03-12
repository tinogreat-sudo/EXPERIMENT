<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ec5b13",
                        "background-light": "#f8f6f6",
                        "background-dark": "#221610",
                    },
                    fontFamily: {
                        "display": ["Public Sans"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<title>Personal OS - AI Coach</title>
</head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
<div class="flex h-screen overflow-hidden">
<!-- Sidebar -->
<aside class="w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark flex flex-col justify-between">
<div class="flex flex-col gap-6 p-4">
<div class="flex items-center gap-3 px-2">
<div class="bg-primary/10 rounded-lg p-2 flex items-center justify-center">
<span class="material-symbols-outlined text-primary">terminal</span>
</div>
<div class="flex flex-col">
<h1 class="text-sm font-bold leading-tight">Personal OS</h1>
<p class="text-slate-500 dark:text-slate-400 text-xs">AI-Powered Workspace</p>
</div>
</div>
<nav class="flex flex-col gap-1">
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-lg transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">dashboard</span>
<span class="text-sm font-medium">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-lg transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">calendar_today</span>
<span class="text-sm font-medium">Schedule</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-lg transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">rebase_edit</span>
<span class="text-sm font-medium">Habits</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-lg transition-colors" href="#">
<span class="material-symbols-outlined text-[20px]">monitoring</span>
<span class="text-sm font-medium">Analytics</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors" href="#">
<span class="material-symbols-outlined text-[20px] fill-[1]">psychology</span>
<span class="text-sm font-bold">AI Coach</span>
</a>
</nav>
</div>
<div class="p-4 border-t border-primary/10">
<div class="flex items-center gap-3 px-2">
<img alt="Profile" class="size-8 rounded-full bg-primary/20" data-alt="User profile avatar circular image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3U2GVm8g6mOqgMsXDlVh95sYn7DZRD4Z0O72GjL3ZdpRlxRVVe7AONyfN8nGkLGmb5hpppEhCR-8zoYgxy9decg5feFooJxhKfsfHnXYGHuj4X8raKPYClTUlzdvO6JcmduPB29xQojMk1DC9Sflo2f4DYFE1MyTzCMpcNLVvvPoKYK6_jLor6MtJVZJDWpTifYgOS-jMZ5nXN4IVWD-I-s_WbDkGoqtFBZOEqI28aAeiSf0xHNeQKfukDyRr3zZYEX_sSW1FiXr9"/>
<div class="flex flex-col overflow-hidden">
<p class="text-xs font-bold truncate">Alex Chen</p>
<p class="text-[10px] text-slate-500 truncate">Pro Plan Active</p>
</div>
<span class="material-symbols-outlined text-slate-400 ml-auto text-lg">settings</span>
</div>
</div>
</aside>
<!-- Main Content -->
<main class="flex-1 flex flex-col bg-slate-50/50 dark:bg-background-dark/50 overflow-hidden">
<!-- Header -->
<header class="h-16 border-b border-primary/10 bg-white dark:bg-background-dark px-6 flex items-center justify-between shrink-0">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">smart_toy</span>
<h2 class="text-lg font-bold">AI Coach</h2>
<span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Active Thinking</span>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
<span class="material-symbols-outlined">search</span>
</button>
<button class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
</header>
<!-- Chat Area -->
<div class="flex-1 overflow-y-auto p-6 space-y-6">
<!-- User Message -->
<div class="flex justify-end gap-3">
<div class="flex flex-col items-end gap-1 max-w-[70%]">
<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">You</span>
<div class="bg-primary text-white px-4 py-3 rounded-xl rounded-tr-none shadow-sm shadow-primary/20">
<p class="text-sm leading-relaxed">I'm feeling stuck on my coding project. I've been staring at the same module for two hours and can't make progress.</p>
</div>
<span class="text-[10px] text-slate-400 px-1">10:42 AM</span>
</div>
<img alt="User" class="size-8 rounded-full shrink-0" data-alt="Small circular user avatar image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbGsuhD-uJUj2_scqQWYWedUfa9Ymj0FxO1l_XuxGDtZ1HFUpDQ_JQG0iT0wjRJEP-lcijhTgOrP2cX7Mc8xw_97lNkaiHerAznctdxLbVgN_jm9Cx9BYirsAv6OY2omZIG1yAHZny3CHTf8qRZHQ8LZpBzQeu9AJwV0G3ZgZmBFd0UpXzpYN53dt6_yzda47g6o6KTNMaAwJAdh4mobM1oEIs4nGgUly1ZxpLIZ2VqTDBXblA6NVmBXOnr_U7cxGEzjPUbGyjFy0a"/>
</div>
<!-- AI Message -->
<div class="flex gap-3">
<div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-primary text-lg">bolt</span>
</div>
<div class="flex flex-col gap-1 max-w-[80%]">
<span class="text-[10px] font-bold text-primary uppercase tracking-widest px-1">AI Coach</span>
<div class="bg-white dark:bg-slate-800 border border-primary/10 px-4 py-3 rounded-xl rounded-tl-none shadow-sm">
<p class="text-sm leading-relaxed mb-4">I understand. Stagnation is often a sign of cognitive overload. I've analyzed your recent work patterns and it looks like you've hit a <strong>Complexity Wall</strong>.</p>
<!-- Analysis Card -->
<div class="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
<div class="flex items-center gap-3 mb-2">
<span class="material-symbols-outlined text-primary">analytics</span>
<h4 class="text-xs font-bold uppercase tracking-wide">Diagnosis: Work Rhythm Analysis</h4>
</div>
<div class="flex items-end gap-1 h-12 mb-3">
<div class="flex-1 bg-primary/40 h-[60%] rounded-t-sm"></div>
<div class="flex-1 bg-primary/40 h-[80%] rounded-t-sm"></div>
<div class="flex-1 bg-primary h-[100%] rounded-t-sm"></div>
<div class="flex-1 bg-slate-300 dark:bg-slate-600 h-[30%] rounded-t-sm"></div>
<div class="flex-1 bg-slate-300 dark:bg-slate-600 h-[10%] rounded-t-sm"></div>
<div class="flex-1 bg-slate-300 dark:bg-slate-600 h-[5%] rounded-t-sm"></div>
</div>
<p class="text-xs text-slate-600 dark:text-slate-400">Your focus levels dropped significantly after 4 context switches in the last hour. Your brain is likely optimized for 'shallow' tasks right now.</p>
</div>
<p class="text-sm leading-relaxed mb-4">Would you like to run a 'Rescue Plan' to rebuild momentum, or should we break down the current block into 5-minute micro-tasks?</p>
<div class="flex flex-wrap gap-2">
<button class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-sm">auto_fix_high</span>
                                    Accept Rescue Plan
                                </button>
<button class="px-3 py-1.5 border border-primary/30 text-primary text-xs font-bold rounded-lg hover:bg-primary/5 transition-colors">
                                    Log 30m Deep Work
                                </button>
</div>
</div>
<span class="text-[10px] text-slate-400 px-1">10:43 AM</span>
</div>
</div>
</div>
<!-- Input Area -->
<div class="p-6 pt-0 shrink-0">
<div class="max-w-4xl mx-auto space-y-4">
<!-- Quick Actions -->
<div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
<button class="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-full text-xs font-medium hover:border-primary transition-colors">
<span class="material-symbols-outlined text-primary text-sm">emergency_home</span>
                            Rescue My Day
                        </button>
<button class="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-full text-xs font-medium hover:border-primary transition-colors">
<span class="material-symbols-outlined text-primary text-sm">help</span>
                            Why Am I Stuck?
                        </button>
<button class="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-full text-xs font-medium hover:border-primary transition-colors">
<span class="material-symbols-outlined text-primary text-sm">summarize</span>
                            Summarize Today
                        </button>
<button class="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-full text-xs font-medium hover:border-primary transition-colors">
<span class="material-symbols-outlined text-primary text-sm">task_alt</span>
                            Plan Tomorrow
                        </button>
</div>
<!-- Input Box -->
<div class="relative group">
<div class="absolute inset-0 bg-primary/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
<div class="relative flex items-center bg-white dark:bg-slate-800 border border-primary/20 rounded-2xl shadow-sm focus-within:border-primary transition-all p-2">
<button class="p-2 text-slate-400 hover:text-primary rounded-xl">
<span class="material-symbols-outlined">add_circle</span>
</button>
<input class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2" placeholder="Type a message or use a shortcut..." type="text"/>
<div class="flex items-center gap-2 px-2">
<button class="p-2 text-slate-400 hover:text-primary rounded-xl">
<span class="material-symbols-outlined">mic</span>
</button>
<button class="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
<span class="material-symbols-outlined">send</span>
</button>
</div>
</div>
</div>
<p class="text-[10px] text-center text-slate-400">Press <kbd class="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700">Cmd + K</kbd> for commands</p>
</div>
</div>
</main>
<!-- Right Sidebar (Contextual Info) -->
<aside class="w-72 hidden xl:flex flex-col border-l border-primary/10 bg-white dark:bg-background-dark p-6 gap-6 overflow-y-auto">
<div>
<h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Focus Stats</h3>
<div class="space-y-4">
<div class="p-3 bg-primary/5 rounded-xl border border-primary/10">
<div class="flex justify-between items-center mb-2">
<span class="text-xs text-slate-500">Deep Work Today</span>
<span class="text-xs font-bold">2h 15m</span>
</div>
<div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
<div class="h-full bg-primary w-[75%] rounded-full"></div>
</div>
</div>
<div class="p-3 bg-primary/5 rounded-xl border border-primary/10">
<div class="flex justify-between items-center mb-2">
<span class="text-xs text-slate-500">Cognitive Load</span>
<span class="text-xs font-bold text-red-500">High</span>
</div>
<div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
<div class="h-full bg-red-500 w-[90%] rounded-full"></div>
</div>
</div>
</div>
</div>
<div>
<h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Upcoming Schedule</h3>
<div class="space-y-3">
<div class="flex gap-3 items-start">
<div class="flex flex-col items-center">
<span class="text-[10px] font-bold text-slate-400">11:30</span>
<div class="w-0.5 h-10 bg-primary/20 rounded-full my-1"></div>
</div>
<div class="flex-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
<p class="text-xs font-bold">Engineering Sync</p>
<p class="text-[10px] text-slate-500">External • Zoom</p>
</div>
</div>
<div class="flex gap-3 items-start opacity-50">
<div class="flex flex-col items-center">
<span class="text-[10px] font-bold text-slate-400">12:30</span>
<div class="w-0.5 h-10 bg-primary/20 rounded-full my-1"></div>
</div>
<div class="flex-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
<p class="text-xs font-bold">Lunch Break</p>
</div>
</div>
</div>
</div>
<div class="mt-auto">
<div class="p-4 rounded-2xl bg-gradient-to-br from-primary to-orange-600 text-white shadow-lg">
<p class="text-xs font-bold mb-1">Upgrade to Master OS</p>
<p class="text-[10px] opacity-90 mb-3">Unlock advanced predictive scheduling and team coaching.</p>
<button class="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">Learn More</button>
</div>
</div>
</aside>
</div>
<style>
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</body></html>