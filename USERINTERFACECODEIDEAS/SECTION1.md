<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Deep Focus - Time Tracker</title>
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
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
<div class="flex h-screen overflow-hidden">
<!-- Sidebar Navigation -->
<aside class="w-64 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden md:flex flex-col">
<div class="p-6 flex items-center gap-3">
<div class="size-8 bg-primary rounded flex items-center justify-center text-white">
<span class="material-symbols-outlined">filter_center_focus</span>
</div>
<h2 class="text-xl font-bold tracking-tight text-primary">Deep Focus</h2>
</div>
<nav class="flex-1 px-4 space-y-1">
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-xl transition-colors" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-medium text-sm">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-xl transition-colors" href="#">
<span class="material-symbols-outlined">check_box</span>
<span class="font-medium text-sm">Tasks</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-xl" href="#">
<span class="material-symbols-outlined filled-icon">timer</span>
<span class="font-medium text-sm">Focus Session</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-xl transition-colors" href="#">
<span class="material-symbols-outlined">ads_click</span>
<span class="font-medium text-sm">Goals &amp; Skills</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-primary/5 rounded-xl transition-colors" href="#">
<span class="material-symbols-outlined">bar_chart</span>
<span class="font-medium text-sm">Analytics</span>
</a>
</nav>
<div class="p-4 mt-auto border-t border-primary/10">
<div class="flex items-center gap-3 p-2">
<div class="size-10 rounded-full bg-primary/20 bg-cover bg-center" data-alt="User profile avatar placeholder" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCYa1oYhvUFhFcEcE0dj22kj_QjOH_mVZuEqqMDGq8-Rtyw9r5tReDcF7InpYZVPH-gNKEpCHq7OkSAwiN0yq4xftaJi5-APGY0g8qBXTIdTWHUjbVcEm90eaX4JO1kfT7L2d8jJPu1cdBV3wEYrkQlCFq9zLOETXushAKrl6k7WmgYPGZVf2fkAH4kVo87XPxBs9PxjtXHaIwFKxmeqzHO5CE9hXS9WHyJ7432AziqBcdpAMi6sAc1niToWcTaNePxQX-XLzohqPu')"></div>
<div class="overflow-hidden">
<p class="text-sm font-bold truncate">Alex Chen</p>
<p class="text-xs text-slate-500">Pro Member</p>
</div>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 flex flex-col overflow-y-auto">
<!-- Header -->
<header class="h-16 border-b border-primary/10 flex items-center justify-between px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm sticky top-0 z-10">
<div class="flex items-center gap-2">
<span class="text-sm text-slate-500 uppercase tracking-widest font-bold">Session Mode:</span>
<span class="text-sm font-bold text-primary">Deep Work</span>
</div>
<div class="flex items-center gap-4">
<button class="p-2 hover:bg-primary/5 rounded-full text-slate-500 transition-colors">
<span class="material-symbols-outlined">history</span>
</button>
<button class="p-2 hover:bg-primary/5 rounded-full text-slate-500 transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
</div>
</header>
<div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-8 max-w-7xl mx-auto w-full">
<!-- Left Column: Timer and Controls -->
<div class="lg:col-span-7 flex flex-col gap-6">
<!-- Main Timer Card -->
<div class="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
<div class="relative z-10">
<span class="text-xs font-bold text-primary tracking-widest uppercase mb-4 block">Focusing on Product Design</span>
<div class="flex items-center justify-center gap-4 mb-8">
<div class="bg-slate-100 dark:bg-slate-800 rounded-2xl w-32 h-40 flex items-center justify-center">
<span class="text-7xl font-bold font-display text-slate-800 dark:text-slate-100">24</span>
</div>
<span class="text-5xl font-bold text-primary animate-pulse">:</span>
<div class="bg-slate-100 dark:bg-slate-800 rounded-2xl w-32 h-40 flex items-center justify-center">
<span class="text-7xl font-bold font-display text-slate-800 dark:text-slate-100">59</span>
</div>
</div>
<div class="flex items-center justify-center gap-6">
<button class="size-14 rounded-full border-2 border-primary/20 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
<span class="material-symbols-outlined text-3xl">replay</span>
</button>
<button class="size-20 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
<span class="material-symbols-outlined text-4xl filled-icon">pause</span>
</button>
<button class="size-14 rounded-full border-2 border-primary/20 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all">
<span class="material-symbols-outlined text-3xl">skip_next</span>
</button>
</div>
</div>
</div>
<!-- Mode Selector -->
<div class="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl p-6 shadow-sm">
<h3 class="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Session Intervals</h3>
<div class="grid grid-cols-2 gap-4">
<label class="relative flex cursor-pointer rounded-xl border-2 border-primary bg-primary/5 p-4 focus:outline-none">
<input checked="" class="sr-only" name="mode" type="radio" value="pomodoro"/>
<span class="flex flex-1">
<span class="flex flex-col">
<span class="block text-sm font-bold text-slate-900 dark:text-slate-100">Pomodoro</span>
<span class="mt-1 flex items-center text-xs text-slate-500 italic">25m Work / 5m Break</span>
</span>
</span>
<span class="material-symbols-outlined text-primary">check_circle</span>
</label>
<label class="relative flex cursor-pointer rounded-xl border-2 border-transparent bg-slate-50 dark:bg-slate-800 p-4 hover:border-primary/30 focus:outline-none transition-colors">
<input class="sr-only" name="mode" type="radio" value="deep"/>
<span class="flex flex-1">
<span class="flex flex-col">
<span class="block text-sm font-bold text-slate-900 dark:text-slate-100">Deep Work</span>
<span class="mt-1 flex items-center text-xs text-slate-500 italic">50m Work / 10m Break</span>
</span>
</span>
</label>
</div>
</div>
</div>
<!-- Right Column: Settings and Context -->
<div class="lg:col-span-5 flex flex-col gap-6">
<!-- Session Configuration -->
<div class="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl p-6 shadow-sm space-y-6">
<div>
<label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Session Category</label>
<div class="grid grid-cols-2 gap-2">
<button class="flex items-center gap-2 p-3 bg-primary/10 text-primary border border-primary rounded-xl text-sm font-medium">
<span class="material-symbols-outlined text-lg">code</span> Development
                                </button>
<button class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300">
<span class="material-symbols-outlined text-lg">palette</span> Design
                                </button>
<button class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300">
<span class="material-symbols-outlined text-lg">book</span> Learning
                                </button>
<button class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300">
<span class="material-symbols-outlined text-lg">mail</span> Admin
                                </button>
</div>
</div>
<div class="pt-4 border-t border-slate-100 dark:border-slate-800">
<label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Energy &amp; Focus Rating</label>
<div class="space-y-4">
<div>
<div class="flex justify-between text-xs font-medium mb-2">
<span class="text-slate-600 dark:text-slate-400 uppercase">Current Energy</span>
<span class="text-primary font-bold uppercase">Level 4</span>
</div>
<div class="flex gap-2">
<button class="h-2 flex-1 rounded-full bg-primary"></button>
<button class="h-2 flex-1 rounded-full bg-primary"></button>
<button class="h-2 flex-1 rounded-full bg-primary"></button>
<button class="h-2 flex-1 rounded-full bg-primary"></button>
<button class="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"></button>
</div>
</div>
<div>
<div class="flex justify-between text-xs font-medium mb-2">
<span class="text-slate-600 dark:text-slate-400 uppercase">Focus Quality</span>
<span class="text-primary font-bold uppercase">Level 3</span>
</div>
<div class="flex gap-2">
<button class="h-2 flex-1 rounded-full bg-primary"></button>
<button class="h-2 flex-1 rounded-full bg-primary"></button>
<button class="h-2 flex-1 rounded-full bg-primary"></button>
<button class="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"></button>
<button class="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"></button>
</div>
</div>
</div>
</div>
<div>
<label class="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Session Notes</label>
<textarea class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-primary focus:border-primary transition-all" placeholder="What are you working on right now?" rows="3"></textarea>
</div>
</div>
<!-- Goals/Skills Link -->
<div class="bg-primary rounded-xl p-6 text-white shadow-lg shadow-primary/20">
<div class="flex items-start justify-between mb-4">
<div>
<h3 class="font-bold text-lg leading-tight">Project Delta</h3>
<p class="text-primary-100/80 text-sm">Target Goal: Q4 Launch</p>
</div>
<span class="material-symbols-outlined opacity-50">ads_click</span>
</div>
<div class="w-full bg-white/20 rounded-full h-1.5 mb-2">
<div class="bg-white h-1.5 rounded-full" style="width: 65%"></div>
</div>
<div class="flex justify-between items-center text-xs font-medium">
<span>65% Progress</span>
<a class="flex items-center gap-1 hover:underline underline-offset-2" href="#">View Skills Needed <span class="material-symbols-outlined text-[14px]">arrow_forward</span></a>
</div>
</div>
</div>
</div>
</main>
</div>
</body></html>