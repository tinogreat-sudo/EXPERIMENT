<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Personal OS - Active Dashboard</title>
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
                        "background-dark": "#1a1412",
                        "surface-dark": "#2a1f1b",
                        "accent-success": "#10b981",
                        "accent-warning": "#f59e0b",
                    },
                    fontFamily: {
                        "display": ["Public Sans", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        body { font-family: 'Public Sans', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .active-fill { font-variation-settings: 'FILL' 1; }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
<div class="flex h-screen overflow-hidden">
<!-- Sidebar Navigation -->
<aside class="w-20 lg:w-64 border-r border-primary/10 bg-background-light dark:bg-background-dark flex flex-col items-center lg:items-start py-6 px-4 gap-8">
<div class="flex items-center gap-3 px-2">
<div class="bg-primary p-2 rounded-xl text-white">
<span class="material-symbols-outlined block">rocket_launch</span>
</div>
<h2 class="hidden lg:block text-xl font-bold tracking-tight">OS.One</h2>
</div>
<nav class="flex flex-col gap-2 w-full">
<a class="flex items-center gap-4 px-3 py-3 rounded-xl bg-primary/10 text-primary font-semibold" href="#">
<span class="material-symbols-outlined active-fill">dashboard</span>
<span class="hidden lg:block">Dashboard</span>
</a>
<a class="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-primary/5 text-slate-500 dark:text-slate-400 transition-colors" href="#">
<span class="material-symbols-outlined">analytics</span>
<span class="hidden lg:block">Analytics</span>
</a>
<a class="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-primary/5 text-slate-500 dark:text-slate-400 transition-colors" href="#">
<span class="material-symbols-outlined">checklist</span>
<span class="hidden lg:block">Habits</span>
</a>
<a class="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-primary/5 text-slate-500 dark:text-slate-400 transition-colors" href="#">
<span class="material-symbols-outlined">psychology</span>
<span class="hidden lg:block">Insights</span>
</a>
</nav>
<div class="mt-auto w-full border-t border-primary/10 pt-6">
<div class="flex items-center gap-3 px-2 mb-6">
<div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden">
<img alt="User avatar" data-alt="Modern geometric avatar of a user profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD47_K61gsl2h0_H5pw2bXo46opeT0vZimOzHJBChqbIbVJ2MBRajA8JQOXcUdMdzUAyeoO3IgvauBYaAPT0UOeD_WBeH7vEixgYn6WFXJfQU9EVZTzPhgd87qHo7TNqhaIUgSirpfuDuwFutLkfYYDWU1d8NoZXfF0pKin-SKauggcZMsl7um5u5o_zHnMTeMGk53v5PIFOnbur-F-KgoWb2KdwRwa9bX4E-3_bOOLEMIbVdm3D-Klqf7tevD4OLeot3m5rgroSToA"/>
</div>
<div class="hidden lg:block">
<p class="text-sm font-bold leading-none">Alex Rivera</p>
<p class="text-xs text-slate-500 mt-1">Lvl 42 Optimizer</p>
</div>
</div>
<button class="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-primary/5 text-slate-500">
<span class="material-symbols-outlined">settings</span>
<span class="hidden lg:block">Settings</span>
</button>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 overflow-y-auto p-4 lg:p-8">
<header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
<div>
<h1 class="text-2xl font-bold tracking-tight">Active Mode</h1>
<p class="text-slate-500 dark:text-slate-400">Focusing on <span class="text-primary font-medium">Core Product Design</span></p>
</div>
<div class="flex items-center gap-3">
<button class="flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors">
<span class="material-symbols-outlined text-lg">emergency</span>
                        Rescue My Day
                    </button>
<button class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-lg">help_outline</span>
                        Why Am I Stuck?
                    </button>
</div>
</header>
<!-- Grid Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
<!-- Left Column: Metrics & Timeline -->
<div class="lg:col-span-8 flex flex-col gap-6">
<!-- Top Stats Row -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<div class="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-primary/5">
<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Efficiency Score</p>
<div class="flex items-end gap-2">
<span class="text-4xl font-bold text-primary">82</span>
<span class="text-slate-400 mb-1 text-sm">/ 100</span>
<span class="text-accent-success text-xs font-bold mb-1 ml-auto flex items-center">
<span class="material-symbols-outlined text-sm">trending_up</span> 4%
                                </span>
</div>
</div>
<div class="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-primary/5">
<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Consistency Streak</p>
<div class="flex items-end gap-2">
<span class="text-4xl font-bold">14</span>
<span class="text-slate-400 mb-1 text-sm">Days</span>
<div class="ml-auto flex gap-1 mb-1">
<div class="size-2 rounded-full bg-primary"></div>
<div class="size-2 rounded-full bg-primary"></div>
<div class="size-2 rounded-full bg-primary/20"></div>
</div>
</div>
</div>
<div class="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-primary/5">
<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Energy Level</p>
<div class="flex items-center gap-3">
<span class="text-4xl font-bold text-accent-warning">High</span>
<div class="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full bg-accent-warning w-[85%] rounded-full"></div>
</div>
</div>
</div>
</div>
<!-- Today's Timeline Visualization -->
<div class="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-primary/5">
<div class="flex items-center justify-between mb-6">
<h3 class="font-bold flex items-center gap-2">
<span class="material-symbols-outlined text-primary">schedule</span>
                                Today's Timeline
                            </h3>
<span class="text-xs text-slate-400">14:24 PM</span>
</div>
<div class="relative pt-2 pb-6">
<!-- Timeline Bar -->
<div class="h-10 w-full flex rounded-xl overflow-hidden mb-8">
<div class="w-[15%] bg-blue-500 h-full flex items-center justify-center text-[10px] text-white font-bold" title="Sleep">ZZZ</div>
<div class="w-[10%] bg-accent-warning h-full flex items-center justify-center text-[10px] text-white font-bold" title="Routine">AM</div>
<div class="w-[30%] bg-primary h-full flex items-center justify-center text-[10px] text-white font-bold" title="Deep Work">DEEP</div>
<div class="w-[5%] bg-slate-300 dark:bg-slate-700 h-full"></div>
<div class="w-[20%] bg-primary/60 h-full flex items-center justify-center text-[10px] text-white font-bold" title="Active Focus">NOW</div>
<div class="flex-1 bg-slate-100 dark:bg-slate-800 h-full border-l-2 border-primary border-dashed relative">
<div class="absolute -top-6 left-0 text-[10px] text-primary font-bold">CURRENT</div>
</div>
</div>
<!-- Timeline Legend -->
<div class="flex flex-wrap gap-4 text-xs text-slate-500">
<div class="flex items-center gap-1"><div class="size-2 rounded-full bg-primary"></div> Deep Work (3.2h)</div>
<div class="flex items-center gap-1"><div class="size-2 rounded-full bg-accent-warning"></div> Routine (1.5h)</div>
<div class="flex items-center gap-1"><div class="size-2 rounded-full bg-slate-300"></div> Distracted (0.4h)</div>
</div>
</div>
</div>
<!-- AI Coach Insight -->
<div class="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20 relative overflow-hidden">
<div class="absolute top-0 right-0 p-4 opacity-10">
<span class="material-symbols-outlined text-6xl">smart_toy</span>
</div>
<div class="relative z-10">
<h3 class="text-sm font-bold text-primary uppercase tracking-widest mb-2">AI Coach Insight</h3>
<p class="text-lg font-medium leading-relaxed max-w-2xl">
                                "You've been in high-focus mode for 45 minutes. Your energy peak usually tapers in 20 mins. Complete this block now, then take a 5-min movement break to sustain momentum."
                            </p>
</div>
</div>
</div>
<!-- Right Column: Timer & Checklist -->
<div class="lg:col-span-4 flex flex-col gap-6">
<!-- Active Timer Card -->
<div class="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center">
<p class="text-slate-400 text-sm font-medium mb-1 uppercase tracking-tighter">Current Sprint</p>
<h3 class="text-xl font-bold mb-6">Product Strategy</h3>
<div class="relative size-48 flex items-center justify-center mb-8">
<svg class="size-full -rotate-90">
<circle class="text-slate-800" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-width="8"></circle>
<circle class="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-dasharray="552.92" stroke-dashoffset="138.23" stroke-linecap="round" stroke-width="8"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="text-5xl font-mono font-bold">18:42</span>
<span class="text-xs text-slate-500 font-bold mt-1">OF 25:00</span>
</div>
</div>
<div class="flex gap-4 w-full">
<button class="flex-1 bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
<span class="material-symbols-outlined active-fill">pause</span> Pause
                            </button>
<button class="size-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center hover:bg-slate-700">
<span class="material-symbols-outlined">stop</span>
</button>
</div>
</div>
<!-- Quick Habit Checklist -->
<div class="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-primary/5">
<div class="flex items-center justify-between mb-4">
<h3 class="font-bold">Today's Habits</h3>
<span class="text-xs font-bold text-primary">3 / 5</span>
</div>
<div class="flex flex-col gap-3">
<label class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
<input checked="" class="rounded text-primary focus:ring-primary size-5" type="checkbox"/>
<span class="text-sm font-medium line-through text-slate-400">Morning Meditation</span>
<span class="material-symbols-outlined ml-auto text-accent-success text-sm">check_circle</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
<input checked="" class="rounded text-primary focus:ring-primary size-5" type="checkbox"/>
<span class="text-sm font-medium line-through text-slate-400">Deep Work Block 1</span>
<span class="material-symbols-outlined ml-auto text-accent-success text-sm">check_circle</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
<input class="rounded text-primary focus:ring-primary size-5" type="checkbox"/>
<span class="text-sm font-medium">Hydration (2L)</span>
<span class="text-[10px] font-bold text-slate-400 ml-auto">PROGRESSING</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
<input class="rounded text-primary focus:ring-primary size-5" type="checkbox"/>
<span class="text-sm font-medium">Read 20 Pages</span>
</label>
<label class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
<input class="rounded text-primary focus:ring-primary size-5" type="checkbox"/>
<span class="text-sm font-medium">No Screen After 9PM</span>
</label>
</div>
</div>
</div>
</div>
</main>
</div>
</body></html>