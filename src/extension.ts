import * as vscode from 'vscode';

const commitTypes: Record<string, string> = {
    'feat': 'A new feature',
    'fix': 'A bug fix',
    'docs': 'Documentation only changes',
    'style': 'Changes that do not affect the meaning of the code',
    'refactor': 'A code change that neither fixes a bug nor adds a feature',
    'perf': 'A code change that improves performance',
    'test': 'Adding missing tests or correcting existing tests',
    'build': 'Changes that affect the build system or external dependencies',
    'ci': 'Changes to CI configuration files and scripts',
    'chore': 'Other changes that don\'t modify src or test files',
    'revert': 'Reverts a previous commit'
};

const commitExamples: Record<string, string> = {
    'feat': 'add user authentication system',
    'fix': 'resolve issue with database connection timeout',
    'docs': 'update README with new API endpoints',
    'style': 'apply consistent indentation to JavaScript files',
    'refactor': 'simplify user registration process',
    'test': 'add unit tests for payment processing module',
    'chore': 'update dependencies to latest versions'
};

export function activate(context: vscode.ExtensionContext) {
    let generateCommit = vscode.commands.registerCommand('extension.generateSemanticCommit', async () => {
        const commitTypeItems: vscode.QuickPickItem[] = Object.entries(commitTypes).map(([type, description]) => ({
            label: type,
            description: description
        }));

        const selectedItem = await vscode.window.showQuickPick(commitTypeItems, {
            placeHolder: 'Select the type of change',
        });

        if (!selectedItem) return;

        const type = selectedItem.label;

        const scope = await vscode.window.showInputBox({
            prompt: 'Enter the scope of this change (optional)',
            placeHolder: 'e.g., auth, user-profile'
        });

        const subject = await vscode.window.showInputBox({
            prompt: 'Enter a short, imperative tense description of the change',
            placeHolder: commitExamples[type]
        });

        if (!subject) return;

        let commitMessage = `${type}`;
        if (scope) commitMessage += `(${scope})`;
        commitMessage += `: ${subject}`;

        vscode.env.clipboard.writeText(commitMessage);
        vscode.window.showInformationMessage(`Commit message copied to clipboard: ${commitMessage}`);
    });

    let showExamples = vscode.commands.registerCommand('extension.showCommitExamples', () => {
        let exampleText = 'Semantic Commit Message Examples:\n\n';
        for (let [type, example] of Object.entries(commitExamples)) {
            exampleText += `${type}: ${example}\n`;
        }
        vscode.window.showInformationMessage(exampleText, { modal: true });
    });

    context.subscriptions.push(generateCommit, showExamples);
}

export function deactivate() {}