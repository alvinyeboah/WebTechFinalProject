# WebTechFinalProject Git Workflow Guide

## Quick Reference

```bash
git add .              # Stage all changes
git commit -m "msg"    # Commit with message
git push origin main   # Push to main branch
```

# Cloning and Initializing the WebTechFinalProject

## Cloning the Repository

1. Open your terminal
2. Navigate to where you want the project folder:
```bash
cd path/to/desired/location
```

3. Clone the repository:
```bash
git clone https://github.com/alvinyeboah/WebTechFinalProject.git
```

## First-Time Setup

1. Navigate into the project folder:
```bash
cd WebTechFinalProject
```

2. Set up your Git identity (if you haven't already):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Verifying Setup

1. Check repository status:
```bash
git status
```

2. View remote repository connection:
```bash
git remote -v
```

You're now ready to start working on the project!

---

Note: If you need to initialize a new repository instead of cloning:
```bash
mkdir WebTechFinalProject
cd WebTechFinalProject
git init
git remote add origin [repository-url]
git pull origin main
```

## Detailed Git Workflow

### 1. Starting Your Work Session

Before you start working, always pull the latest changes:

```bash
git pull origin main
```

### 2. Making Changes

Work on your files as normal. When you're ready to save your changes:

#### Check Status (Optional but Recommended)
```bash
git status
```
This shows you which files have been modified.

### 3. Staging Changes

To stage all changed files:
```bash
git add .
```

To stage specific files:
```bash
git add filename1 filename2
```

### 4. Committing Changes

```bash
git commit -m "Brief description of changes"
```

#### Tips for Good Commit Messages:
- Keep it short (50 chars or less)
- Use present tense ("Add feature" not "Added feature")
- Be specific ("Add user authentication" vs "Update code")

#### Examples of Good Commit Messages:
- "Add responsive navbar"
- "Fix login form validation"
- "Update API endpoint documentation"

### 5. Pushing Changes

```bash
git push origin {your branch name}
```

## Best Practices

1. **Commit Often**: Make small, frequent commits rather than large, infrequent ones
2. **Pull Before Push**: Always `git pull` before pushing to avoid conflicts
3. **Check Status**: Use `git status` regularly to understand what's changed
4. **Review Before Committing**: Use `git diff` to review changes before committing

## Common Issues and Solutions

### If you forgot to pull before making changes:
```bash
git stash
git pull origin main
git stash pop
```

### If you need to undo your last commit:
```bash
git reset --soft HEAD~1
```

## Setting Up Git Aliases for Faster Workflow

Add these to your `.gitconfig` file:

```
[alias]
    a = add .
    c = commit -m
    p = push origin main
    s = status
```

Then you can use:
```bash
git a           # Instead of git add .
git c "message" # Instead of git commit -m "message"
git p           # Instead of git push origin main
git s           # Instead of git status
```

## Need Help?

If you're stuck, try these resources:
- [Git Documentation](https://git-scm.com/doc)
- Ask a team member!
- Check Stack Overflow for specific error messages

---

Remember: When in doubt, commit often and push regularly! 🚀
