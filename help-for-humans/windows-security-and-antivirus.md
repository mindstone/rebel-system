---
description: "Windows security, code signing, and antivirus guidance for Rebel: what to do if your security software flags the app"
---

# Windows Security & Antivirus

Rebel is a signed, verified application from Mindstone Learning Limited. However, some antivirus software may flag Rebel during installation or first launch due to its advanced capabilities. This guide explains why this happens and how to resolve it.


## See also

- [troubleshooting.md](library://rebel-system/help-for-humans/troubleshooting.md) — General troubleshooting guide
- [where-rebel-stores-things.md](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — App data locations
- [permissions.md](library://rebel-system/help-for-humans/permissions.md) — System permissions Rebel needs


---

## Why Security Software May Flag Rebel

Rebel's automation features—managing files, connecting to services, and running tools on your behalf—can sometimes trigger security software designed to detect potentially unwanted behavior.

**Common triggers:**

| Behavior | Why Rebel does it | Why AV may flag it |
|----------|-------------------|-------------------|
| Reading/writing files | Manages your conversations and memory | File access patterns |
| Running background processes | Tool connections and voice features | Process spawning |
| Network connections | Communicates with AI services | Outbound connections |
| Auto-updates | Keeps the app current | Self-modification |

**Important:** If you downloaded Rebel from our official website, these are most likely false positives. Verify the digital signature (see below) to confirm the app is legitimate before adding exclusions.


---

## Verifying Rebel Is Legitimate

Before adding exclusions, you can verify Rebel is properly signed:

1. Right-click `Mindstone Rebel.exe` in your installation folder
2. Select **Properties** → **Digital Signatures** tab
3. You should see **Mindstone Learning Limited** as the signer
4. Click **Details** → **View Certificate** to confirm the certificate is valid

**Default installation location:** `%LOCALAPPDATA%\Programs\mindstone-rebel\`

To open this folder, press `Win+R`, type `%LOCALAPPDATA%\Programs\mindstone-rebel`, and press Enter.

**Note:** If you're using the beta version, the folder is `mindstone-rebel-beta` instead.


---

## Adding Antivirus Exclusions

If your security software blocks or quarantines Rebel, add an exclusion for the installation folder. 

**Before adding exclusions:**
- Try restoring from quarantine and allowing the app first
- Only add folder exclusions if the problem keeps happening
- Exclude only the Rebel folder—not your entire Downloads folder or drive

Below are instructions for common antivirus products. If your AV interface looks different, search for "exclusions" or "exceptions" in your AV settings.

### Windows Security (Windows Defender)

Windows Defender is built into Windows 10 and 11.

1. Open **Windows Security** (search for it in the Start menu)
2. Go to **Virus & threat protection**
3. Under "Virus & threat protection settings", click **Manage settings**
4. Scroll to **Exclusions** and click **Add or remove exclusions**
5. Click **Add an exclusion** → **Folder**
6. Navigate to `%LOCALAPPDATA%\Programs\mindstone-rebel` and select it

[Official Microsoft documentation →](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)


### Norton Antivirus / Norton 360

1. Open **Norton**
2. Go to **Security** → click **Open** on the Scans tile
3. Select the **Exclusions** tab
4. Click **Add** or **Add Exclusion**
5. Browse to `%LOCALAPPDATA%\Programs\mindstone-rebel` and add it

[Official Norton documentation →](https://support.norton.com/sp/en/us/home/current/solutions/v20240108162522348)


### Avast Antivirus

1. Open **Avast Antivirus**
2. Click **Menu** (☰) → **Settings**
3. Go to **General** → **Exceptions**
4. Click **Add exception**
5. Enter `%LOCALAPPDATA%\Programs\mindstone-rebel` and save

[Official Avast documentation →](https://support.avast.com/en-us/article/antivirus-scan-exclusions)


### AVG Antivirus

1. Open **AVG Antivirus**
2. Click **Menu** (☰) → **Settings**
3. Go to **General** → **Exceptions**
4. Click **Add exception** (confirm the prompt if shown)
5. Choose **Folder** and browse to `%LOCALAPPDATA%\Programs\mindstone-rebel`

[Official AVG documentation →](https://support.avg.com/SupportArticleView?l=en&urlName=avg-antivirus-scan-exclusions)


### Malwarebytes

1. Open **Malwarebytes**
2. Go to **Detection History** → **Allow List** tab
3. Click **Add** → **Allow a file or folder**
4. Select the `%LOCALAPPDATA%\Programs\mindstone-rebel` folder
5. Choose "Exclude from all detections" and click **Done**

[Official Malwarebytes documentation →](https://help.malwarebytes.com/hc/en-us/articles/31589553442715-Manage-the-Allow-List-in-Malwarebytes-for-Windows-v4)


### Bitdefender GravityZone (Enterprise)

If your organization uses Bitdefender GravityZone, your IT administrator can add a folder exclusion via the GravityZone Control Center:

1. Log in to the **GravityZone Control Center**
2. Go to **Policies** and select the policy applied to your endpoints (or create a new one)
3. Navigate to **Antimalware** → **Exclusions**
4. Click **In-Policy Exclusions** and select **Add**
5. Choose **Folder** and enter `%LOCALAPPDATA%\Programs\mindstone-rebel\`
6. Select scanning type: **On-access** and **On-demand**
7. Add a description (e.g., "Mindstone Rebel - approved application")
8. Click **Add**, then **Save** the policy

**For Application Control:** If your organization uses GravityZone's Application Control module, administrators can explicitly allow Rebel by adding it to the application whitelist based on its signing certificate (`CN=Mindstone Learning Limited`).

[Official Bitdefender exclusions documentation →](https://www.bitdefender.com/business/support/en/77212-343054-resolving-legitimate-applications-detected-as-threats-by-bitdefender.html)


### Other Security Software

For other antivirus products, look for options like:
- **Exclusions** or **Exceptions**
- **Allowed applications** or **Trusted apps**
- **Whitelist** or **Safe list**

Add the folder path: `%LOCALAPPDATA%\Programs\mindstone-rebel\`


---

## Additional Exclusions for Performance

The exclusions above cover Rebel's installation folder. If you experience file access errors, slow performance, or "file in use" messages when working with files in your workspace, consider adding these additional exclusions:

### App Data Folder

Rebel stores conversations, settings, and cached data here:

`%APPDATA%\mindstone-rebel\`

To open this folder, press `Win+R`, type `%APPDATA%\mindstone-rebel`, and press Enter.

### Your Workspace Folders

If you've connected Rebel to a workspace (for example, `C:\Users\You\Documents\Work`), excluding that folder from real-time scanning can improve performance.

**Why this helps:** Rebel monitors your workspace for file changes so it can help you work with your files. When your antivirus also monitors those same files in real-time, they can conflict—both trying to access the same file simultaneously. This is especially noticeable with large workspaces or when saving files rapidly.

**To add workspace exclusions:** Follow the same steps as above for your antivirus product, but add your workspace folder path instead of the installation folder.

**Note:** Only exclude folders you trust. Your workspace should contain your own work files, not untrusted downloads.


---

## Windows SmartScreen Warnings

When you first run the Rebel installer, Windows SmartScreen may show "Windows protected your PC" because the app is new to your system.

**To proceed:**
1. Click **More info**
2. Verify the publisher shows **Mindstone Learning Limited**
3. Click **Run anyway**

This warning typically appears only once. After installation, Windows learns to trust the application.


---

## Windows Firewall

Rebel needs network access to communicate with AI services and manage tool connections. Windows Firewall may prompt you to allow this.

**If you see a firewall prompt:**
- Click **Allow access** to let Rebel connect to the internet
- If you accidentally blocked it, go to **Windows Security → Firewall & network protection → Allow an app through firewall** and enable Rebel

**If Rebel's connectors aren't working:**
1. Open **Windows Security**
2. Go to **Firewall & network protection**
3. Click **Allow an app through firewall**
4. Find **Mindstone Rebel** and ensure both Private and Public boxes are checked


---

## Recovering Quarantined or Blocked Downloads

If your browser or antivirus blocks the installer during download, you'll need to restore it before you can run it.

**If the installer was blocked during download:**
1. Check your browser's download history or your Downloads folder
2. Look in your antivirus quarantine (see below)
3. Restore the file, then run it

**If your antivirus quarantined Rebel files:**

1. Open your antivirus software
2. Find the **Quarantine** or **Threat History** section
3. Locate the Rebel files (usually named `Mindstone Rebel.exe` or similar)
4. Select **Restore** or **Allow**
5. Add the exclusion (see above) to prevent future quarantines

If files were deleted, you may need to reinstall Rebel after adding the exclusion.


---

## Enterprise Environments

If you're using Rebel in a corporate environment with managed security software:

**Contact your IT team** and provide them with:
- **Publisher:** Mindstone Learning Limited
- **Certificate subject:** `CN=Mindstone Learning Limited`
- **Install location:** `%LOCALAPPDATA%\Programs\mindstone-rebel\`

IT administrators can add exclusions centrally through group policy or their security management console.


### Pre-Onboarding Checklist for IT Teams

When deploying Rebel to multiple users in your organization, prepare these items in advance to ensure smooth onboarding:

**1. Identify antivirus software**
- Determine which antivirus/security products are deployed (Windows Defender, Bitdefender, Norton, etc.)
- Prepare exclusion instructions for your specific security software

**2. Required exclusion paths**
Add these paths to your antivirus exclusions **before** the pilot onboarding session:
- `%LOCALAPPDATA%\Programs\mindstone-rebel\` — Application installation folder
- `%APPDATA%\mindstone-rebel\` — Application data and settings
- User workspace folders (if known) — Where users will store their Rebel workspaces

**3. Microsoft 365 admin consent** (if applicable)
If your organization uses Microsoft 365, consider granting tenant-wide admin consent so users can connect Microsoft tools without individual approval. See [Microsoft 365 connector documentation](library://rebel-system/help-for-humans/connectors/microsoft-365.md#enterprise-admin-consent-for-it-administrators) for details.

**4. Network/firewall access**
- Ensure outbound HTTPS connections are allowed for Rebel to communicate with AI services
- Default ports: 443 (HTTPS), plus dynamic ports for MCP tool connections
- Consider whitelisting `*.mindstone.com` and `*.anthropic.com` domains

This preparation is especially important for multi-user onboarding sessions (e.g., 8-45 users) where installation issues can disrupt the experience.


---

## Still Having Issues?

If you've added exclusions but Rebel still isn't working:

1. **Restart your computer** — Some exclusions require a restart to take effect
2. **Check for multiple security products** — If you have more than one antivirus installed, add exclusions to all of them
3. **Run System Check** — Open Rebel, go to **Settings → Advanced → Run System Check** to identify specific issues
4. **Export diagnostics** — Use **Settings → Advanced → Download Enhanced (.zip)** and contact support

For general troubleshooting, see [troubleshooting.md](library://rebel-system/help-for-humans/troubleshooting.md).
