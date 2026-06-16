# Azure Blob Storage — Static Website Hosting

## Live URL

🌐 **[https://mytestwebsite2025.z13.web.core.windows.net/](https://mytestwebsite2025.z13.web.core.windows.net/)**

---

## Project Overview

This project demonstrates how to host a static website using **Azure Blob Storage Static Website Hosting** — a serverless, cost-effective alternative to traditional web servers like Apache or Nginx.

Instead of provisioning a Virtual Machine and configuring a web server, all HTML, CSS, and JavaScript files are uploaded directly into Azure's `$web` blob container, which Azure exposes as a public HTTPS endpoint automatically.

---

## Architecture Summary

| Setting | Value | Notes |
|---|---|---|
| Cloud Provider | Microsoft Azure | |
| Service | Azure Blob Storage (StorageV2) | General purpose v2 |
| Hosting Method | Static Website Hosting via `$web` container | |
| Region | East US | Low latency, free-tier eligible |
| Performance Tier | Standard | HDD-backed |
| Redundancy | Locally Redundant Storage (LRS) | 3 copies within one datacentre |
| Index Document | `index.html` | Served at root URL `/` |
| Error Document | `404.html` | Served for any missing path |

---

## Files

| File | Purpose |
|---|---|
| `src/index.html` | Main homepage served at the root URL |
| `src/404.html` | Custom error page for missing paths |
| `src/styles.css` | All page styles — responsive, no framework |
| `src/main.js` | Scroll animations and console logging |
| `screenshots/` | Azure Portal screenshots documenting the setup |

---

## How It Works

1. A Storage Account (`mytestwebsite2025`) was provisioned in the Azure Portal.
2. **Static Website Hosting** was enabled — this automatically created the `$web` container and generated a dedicated public HTTPS endpoint.
3. The index document was set to `index.html` and the error document path to `404.html`.
4. All four source files (`index.html`, `404.html`, `styles.css`, `main.js`) were uploaded directly into the `$web` container.
5. Azure serves these files publicly via the primary endpoint URL.
6. Any request to an unknown path (e.g. `/missing`) automatically serves the custom `404.html` error page.

---

## Tech Stack

- HTML5 + CSS3 (no framework)
- Vanilla JavaScript (no dependencies)
- Microsoft Azure Blob Storage (StorageV2)
- Azure Static Website Hosting

---

## Design Decisions

### Why Standard Performance Tier?

Standard performance uses **HDD-backed storage**, which is ideal for static websites with low to moderate traffic. The use case here — a simple HTML/CSS/JS website — has no throughput demands that would justify the extra cost of Premium (SSD-backed) storage. Premium tier is designed for workloads like databases and high-transaction applications where sub-millisecond latency is critical.

**Cost impact:** Standard LRS in East US costs approximately **$0.018 per GB per month** for storage and $0.087 per GB for data transfer (first 10 GB/month free). For a site of this size (< 10 KB of content), the monthly cost rounds to essentially zero.

### Why LRS (Locally Redundant Storage)?

LRS stores **3 synchronous copies of data within a single Azure datacentre**. If one disk fails, the data is immediately available on another. This is sufficient for a learning project or low-traffic static site where:

- The content is non-critical (it can be re-uploaded from source control if lost)
- The cost needs to be minimised
- Cross-region replication is not required

**GRS (Geo-Redundant Storage)** would replicate data asynchronously across a secondary region (e.g. West US), protecting against a full datacentre failure. For a production site serving global traffic with SLA requirements, GRS would be appropriate — but at roughly **double the cost** of LRS, it is not justified here.

**ZRS (Zone-Redundant Storage)** spreads copies across 3 availability zones in the same region, offering higher availability than LRS without crossing regional boundaries — a good middle-ground option for production use.

### Why Azure Blob Storage Instead of a VM?

| | Azure VM + Nginx | Azure Blob Storage |
|---|---|---|
| Server management | Manual patching, updates | None |
| OS to configure | Yes | No |
| HTTPS setup | Manual (Let's Encrypt / cert management) | Automatic on primary endpoint |
| Scaling | Manual vertical/horizontal | Automatic |
| Cost for static site | ~$15–30/month (B1s VM) | ~$0.00–0.01/month |
| Cold start / downtime | Possible if VM restarts | None |

For a purely static frontend (no server-side logic), Blob Storage is the clearly superior choice on cost, operational overhead, and reliability.

---

## Security Review

| Control | Status | Notes |
|---|---|---|
| HTTPS | ✅ Enabled by default | Azure enforces HTTPS on the primary endpoint |
| Secure transfer required | ✅ Enabled | REST API calls must use HTTPS |
| Storage account key access | ✅ Enabled | Managed via Azure Portal IAM |
| Blob public access | Read-only (anonymous) | Scoped to `$web` container only |
| No server-side code | ✅ | Zero runtime attack surface — nothing executes on the server |
| DDoS protection | Basic (included) | Azure Platform DDoS Basic is applied automatically |

**Risk note:** The default endpoint exposes files publicly by design — this is the intended behaviour for a static website. Sensitive data should never be uploaded to the `$web` container.

---

## Scalability & Future Improvements

### 1. Azure CDN Integration
Integrating **Azure CDN** (or **Azure Front Door**) would cache content at edge nodes globally, reducing latency for international visitors. CDN also enables:
- Custom domain support (e.g. `www.adebola.dev`)
- HTTPS on custom domains via managed certificates
- Compression (Brotli / Gzip) at the edge

### 2. Custom Domain
The current endpoint (`mytestwebsite2025.z13.web.core.windows.net`) would be replaced with a branded domain by:
1. Purchasing/configuring a domain in Azure DNS or a third-party registrar
2. Mapping a CNAME record to the CDN endpoint
3. Enabling Azure-managed HTTPS on the CDN custom domain

### 3. Performance Metrics
A Lighthouse audit of the current site would serve as a pre-CDN baseline. Post-CDN integration, metrics like **First Contentful Paint (FCP)** and **Time to First Byte (TTFB)** should improve measurably for users outside East US.

### 4. CI/CD Pipeline
A GitHub Actions workflow could automate deployments — on every push to `main`, files are uploaded to the `$web` container via the Azure CLI:

```yaml
- name: Upload to Azure Blob Storage
  uses: azure/CLI@v1
  with:
    azcliversion: latest
    inlineScript: |
      az storage blob upload-batch \
        --account-name mytestwebsite2025 \
        --destination '$web' \
        --source ./src \
        --overwrite
```

---

## Screenshots

| Screenshot | Description |
|---|---|
| `screenshots/storage-account-overview.png` | Storage account overview in Azure Portal |
| `screenshots/static-website-settings.png` | Static website feature enabled with index/error doc configured |
| `screenshots/web-container-contents.png` | `$web` container showing uploaded files |
| `screenshots/live-site.png` | Live homepage at the Azure endpoint URL |
| `screenshots/404-error-page.png` | Custom 404 page at `/missing` path |

---

## Author

**Adebola Shopeju** — [GitHub @adebola-shopeju](https://github.com/adebola-shopeju)
