<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Day Planner | Personal OS</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
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
<style>
        body { font-family: 'Public Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .filled-icon { font-variation-settings: 'FILL' 1; }
        .time-grid { grid-template-columns: 80px 1fr; }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
<div class="relative flex min-h-screen w-full flex-col">
<!-- Top Navigation Bar -->
<header class="flex items-center justify-between border-b border-slate-200 dark:border-primary/20 px-6 lg:px-20 py-4 bg-background-light dark:bg-background-dark sticky top-0 z-50">
<div class="flex items-center gap-4">
<div class="p-2 bg-primary rounded-lg text-white">
<span class="material-symbols-outlined block">auto_awesome</span>
</div>
<div>
<h2 class="text-lg font-bold leading-tight tracking-tight">Personal OS</h2>
<p class="text-xs text-slate-500 dark:text-primary/60 font-medium">Intentional Living</p>
</div>
</div>
<nav class="hidden md:flex items-center gap-8">
<a class="text-sm font-semibold text-primary" href="#">Schedule</a>
<a class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Dashboard</a>
<a class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Tasks</a>
<a class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Notes</a>
</nav>
<div class="flex items-center gap-3">
<button class="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-primary">
<span class="material-symbols-outlined">calendar_month</span>
</button>
<button class="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-primary">
<span class="material-symbols-outlined">settings</span>
</button>
<div class="rounded-full size-10 bg-primary/20 border-2 border-primary overflow-hidden">
<img class="w-full h-full object-cover" data-alt="User profile avatar wearing a dark shirt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQJTnv0Ue0BwMA-NSRAVGgUmsSYLiWynEBo1NgX7qxXz5un7gP2LsaLjg3zUKVJi9pBZ1iFeu56Wywnpt_ooULCDNzYA5Uk8qMk9zXDDwzk6iUOUN9uCl-PTYGAt4sLqO5TkEsGxymPGASIkvLvgT7Fd4ZpmjXYHN2bS9lXlejTQomiCffNSN2VOc0O4gYR_yXJAy4AhDyRdt34FXEwq8g7S6jsqR6d97IzggWkSvuB9EbO_Ls0nNhp6V4xTnqgLgmOq1lvJhtIwU4"/>
</div>
</div>
</header>
<main class="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
<!-- Header Controls -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
<div>
<h1 class="text-3xl font-extrabold mb-2">Daily Planner</h1>
<div class="flex items-center gap-4">
<span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">Thursday, Oct 24</span>
<div class="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
<span class="material-symbols-outlined text-sm">schedule</span>
<span>85% Planned Capacity</span>
</div>
</div>
</div>
<div class="flex items-center gap-3">
<button class="flex items-center gap-2 px-4 h-11 rounded-xl bg-slate-100 dark:bg-primary/10 text-slate-800 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-primary/20 hover:bg-slate-200 transition-colors">
<span class="material-symbols-outlined text-lg">layers</span>
<span>Load Template</span>
</button>
<button class="flex items-center gap-2 px-6 h-11 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
<span class="material-symbols-outlined text-lg">add</span>
<span>Add Block</span>
</button>
</div>
</div>
<!-- Tabs & Legend -->
<div class="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 dark:border-primary/10 mb-6 gap-4">
<div class="flex gap-8">
<a class="pb-4 border-b-2 border-primary text-primary font-bold text-sm tracking-wide" href="#">Today</a>
<a class="pb-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-700 transition-colors" href="#">Tomorrow</a>
<a class="pb-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-bold text-sm hover:text-slate-700 transition-colors" href="#">Upcoming</a>
</div>
<div class="flex items-center gap-4 pb-4">
<div class="flex items-center gap-2">
<div class="size-3 rounded-sm bg-primary"></div>
<span class="text-xs font-medium text-slate-500">Planned</span>
</div>
<div class="flex items-center gap-2">
<div class="size-3 rounded-sm bg-primary/30"></div>
<span class="text-xs font-medium text-slate-500">Actual</span>
</div>
<div class="flex items-center gap-2 border-l border-slate-300 dark:border-slate-700 pl-4">
<span class="text-xs font-medium text-slate-500">Show Non-Negotiable</span>
<button class="relative inline-flex h-5 w-9 items-center rounded-full bg-primary/20">
<span class="translate-x-5 inline-block h-4 w-4 transform rounded-full bg-primary transition"></span>
</button>
</div>
</div>
</div>
<!-- Schedule View -->
<div class="grid time-grid">
<!-- Time Column -->
<div class="flex flex-col">
<div class="h-20 flex items-start justify-end pr-4 py-2 border-r border-slate-200 dark:border-primary/10">
<span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">08 AM</span>
</div>
<div class="h-20 flex items-start justify-end pr-4 py-2 border-r border-slate-200 dark:border-primary/10 bg-primary/5">
<span class="text-xs font-bold text-primary uppercase tracking-tighter">09 AM</span>
</div>
<div class="h-20 flex items-start justify-end pr-4 py-2 border-r border-slate-200 dark:border-primary/10 bg-primary/5">
<span class="text-xs font-bold text-primary uppercase tracking-tighter">10 AM</span>
</div>
<div class="h-20 flex items-start justify-end pr-4 py-2 border-r border-slate-200 dark:border-primary/10">
<span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">11 AM</span>
</div>
<div class="h-20 flex items-start justify-end pr-4 py-2 border-r border-slate-200 dark:border-primary/10">
<span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">12 PM</span>
</div>
<div class="h-20 flex items-start justify-end pr-4 py-2 border-r border-slate-200 dark:border-primary/10">
<span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">01 PM</span>
</div>
<div class="h-20 flex items-start justify-end pr-4 py-2 border-r border-slate-200 dark:border-primary/10">
<span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">02 PM</span>
</div>
</div>
<!-- Events Column -->
<div class="relative min-h-[560px] bg-slate-50/50 dark:bg-primary/5 rounded-r-xl overflow-hidden">
<!-- 08:00 Block -->
<div class="absolute top-0 left-0 w-full h-20 p-2">
<div class="h-full bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-lg p-3 flex items-start gap-3 shadow-sm group cursor-pointer hover:border-primary/50 transition-all">
<div class="p-1.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
<span class="material-symbols-outlined text-lg">self_improvement</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-start">
<h4 class="text-sm font-bold">Morning Routine</h4>
<span class="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 rounded">HABIT</span>
</div>
<p class="text-xs text-slate-500">08:00 - 09:00</p>
</div>
</div>
</div>
<!-- 09:00 Block (Time-Blocked Range) -->
<div class="absolute top-20 left-0 w-full h-40 p-2">
<div class="relative h-full bg-primary/10 border-l-4 border-primary rounded-lg overflow-hidden group">
<!-- Planned vs Actual comparison bar -->
<div class="absolute top-0 right-0 w-1.5 h-full bg-primary/20">
<div class="absolute bottom-0 w-full h-[70%] bg-primary"></div>
</div>
<div class="p-4">
<div class="flex justify-between items-start mb-1">
<div class="flex items-center gap-2">
<h4 class="text-base font-bold text-primary">Deep Work: Platform Redesign</h4>
<span class="material-symbols-outlined text-primary text-sm filled-icon" title="Non-negotiable">verified</span>
</div>
<span class="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full">FOCUS</span>
</div>
<p class="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
<span class="material-symbols-outlined text-sm">alarm_on</span>
                                    09:00 - 11:00 (Target: 120m | Actual: 85m)
                                </p>
<div class="mt-4 flex -space-x-2">
<div class="size-6 rounded-full ring-2 ring-white dark:ring-background-dark bg-slate-300 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Team member profile picture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEhoKpDTk0570rb_Oo4UqUhuPJ8izP5UeRoUpQw914CHoZrGcTCKc5cMtI0K4tSu89LWksLM-PN25Qq9FIg8aGCk7_kXZEJydgkB7OW6qu9ZnA-fX_4uAdOjVO4xlqEN49ouSlfmUw6s0GvjdbqwTyh2Ox40c6_RZjQrdhZ9l82y-JIZ_genGXsJJbuz0PgWDTXKxO2JKEDP7olDRjz2nOw_RAkvPyk2Vukmn3y4MjZzpfoSk846_uWWG0ovKsGlmUgci4g9vSjlNz"/>
</div>
<div class="size-6 rounded-full ring-2 ring-white dark:ring-background-dark bg-slate-300 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Team member profile picture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt_LKlEEJdPIkT4KQo3sVRlXgIH4eKo-El2pcd3x3eCXmAhORCRDCHd06KCccW7O9lZMxCZUdQOhpictcWuxVN7J6s_cd_dt3lWZceqzSWQZr8AZwK2Eiv4OYx4AyYvq_D_14Kqfc9yyRCoFFhqEE1DIDao4dZkwzXGP77S6FnnZrUd8J3jQiTw8VZVn_xeHJt_ohaq9BeaoWeczNp1eSQybiXPmJCTgMI3Eh9e5VlBMTEkpnsn75WG_iXHO682qsdC3oH7aX2n0ab"/>
</div>
<div class="size-6 rounded-full ring-2 ring-white dark:ring-background-dark bg-primary flex items-center justify-center text-[8px] font-bold text-white uppercase">
                                        +3
                                    </div>
</div>
</div>
</div>
</div>
<!-- 11:00 Block -->
<div class="absolute top-[240px] left-0 w-full h-20 p-2">
<div class="h-full bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-lg p-3 flex items-start gap-3 shadow-sm">
<div class="p-1.5 rounded bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
<span class="material-symbols-outlined text-lg">coffee</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-start">
<h4 class="text-sm font-bold">Inbox Zero &amp; Quick Tasks</h4>
<span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 rounded">ADMIN</span>
</div>
<p class="text-xs text-slate-500">11:00 - 12:00</p>
</div>
</div>
</div>
<!-- 12:00 (Current Time Marker) -->
<div class="absolute top-[320px] left-0 w-full flex items-center gap-2 z-10">
<div class="h-[1px] flex-1 bg-primary"></div>
<div class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">12:30 PM</div>
<div class="h-[1px] flex-1 bg-primary"></div>
</div>
<!-- 01:00 Block (Ghost/Unfilled Planned) -->
<div class="absolute top-[400px] left-0 w-full h-20 p-2">
<div class="h-full border-2 border-dashed border-slate-200 dark:border-primary/20 rounded-lg p-3 flex items-start gap-3 opacity-60">
<div class="p-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
<span class="material-symbols-outlined text-lg">restaurant</span>
</div>
<div class="flex-1">
<h4 class="text-sm font-bold text-slate-400 italic">Lunch Break (Pending)</h4>
<p class="text-xs text-slate-400">01:00 - 02:00</p>
</div>
</div>
</div>
</div>
</div>
<!-- Stats Footer -->
<div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<div class="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-4 rounded-xl">
<p class="text-xs font-bold text-slate-500 uppercase mb-1">Productive Time</p>
<div class="flex items-end gap-2">
<span class="text-2xl font-black text-primary">5.2h</span>
<span class="text-xs text-emerald-500 font-bold mb-1">+12% vs avg</span>
</div>
</div>
<div class="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-4 rounded-xl">
<p class="text-xs font-bold text-slate-500 uppercase mb-1">Deep Work Sessions</p>
<div class="flex items-end gap-2">
<span class="text-2xl font-black">2 / 3</span>
<span class="text-xs text-slate-400 font-bold mb-1">Planned</span>
</div>
</div>
<div class="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-4 rounded-xl">
<p class="text-xs font-bold text-slate-500 uppercase mb-1">Completion Rate</p>
<div class="flex items-end gap-2">
<span class="text-2xl font-black text-emerald-500">92%</span>
<div class="w-20 h-2 bg-slate-100 rounded-full mb-2 overflow-hidden">
<div class="h-full bg-emerald-500 w-[92%]"></div>
</div>
</div>
</div>
<div class="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-4 rounded-xl">
<p class="text-xs font-bold text-slate-500 uppercase mb-1">Remaining Tasks</p>
<div class="flex items-end gap-2">
<span class="text-2xl font-black text-primary">4</span>
<span class="text-xs text-slate-400 font-bold mb-1">To go</span>
</div>
</div>
</div>
</main>
</div>
</body></html>