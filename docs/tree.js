var color = {
    root: "#DDDDDD",
    group: "#BBBBFF",
    works: "#FF5722",
    fails: "#8BC34A",
    todo: "#FFA500"
}

var data = [ {
        id: 1,
        title: "Spectre-Attack",
        img: "spectre-root.svg",
        text_top: "prediction",
        description: "Spectre exploits a performance optimization in modern CPUs. Instead of waiting for the correct resolution of a branch, the CPU tries to predict the most likely outcome of the branch and starts transiently executing along the predicted path. Upon resolving the branch, the CPU discards the results of the transient execution if the prediction was wrong but does not revert changes in the microarchitecture. The prediction is based on events in the past, allowing an attacker to mistrain the predictor to leak data through the microarchitecture that should normally not be accessible to the attacker.",
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        color: color.root
    }, {
        id: 2,
        title: "Spectre-PHT",
        alias: "Spectre v1",
        img: "spectre.svg",
        text_top: "microarchitectural buffer",
        father: 1,
        description: "Kocher et al. first introduced Spectre-PHT, an attack that poisons the Pattern History Table (PHT) to mispredict the direction (taken or not-taken) of conditional branches. Depending on the underlying microarchitecture, the PHT is accessed based on a combination of virtual address bits of the branch instruction plus a hidden Branch History Buffer (BHB) that accumulates global behavior for the last N branches on the same physical core.",
        sources: [
            sources["Canella2018"],
            sources["Kocher2019"],
            sources["Evtyushkin2018"],
            sources["Fog"]
        ],
        names: [
            {
                title: "Spectre variant 1",
                url: "https://spectreattack.com/"
            },
            {
                title: "Spectre variant 1.1",
                url: "https://arxiv.org/pdf/1807.03757.pdf"
            },
            {
                title: "Bounds Check Bypass (BCB)",
                url: "https://software.intel.com/security-software-guidance/api-app/sites/default/files/336983-Intel-Analysis-of-Speculative-Execution-Side-Channels-White-Paper.pdf"
            }
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        poc: [{
                title: "https://github.com/IAIK/transientfail",
                url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT"
            },
            {
                title: "https://github.com/google/safeside",
                url: "https://github.com/google/safeside/tree/master/demos"
            }
        ],
        color: color.group
    }, {
        id: 3,
        title: "Spectre-BTB",
        alias: "Spectre v2",
        img: "spectre.svg",
        father: 1,
        description: "In Spectre-BTB, the attacker poisons the Branch Target Buffer (BTB) to steer the transient execution to a mispredicted branch target. For direct branches, the CPU indexes the BTB using a subset of the virtual address bits of the branch instruction to yield the predicted jump target. For indirect branches, CPUs use different mechanisms, which may take into account global branching history accumulated in the BHB when indexing the BTB. We refer to both types as Spectre-BTB.<p>Contrary to Spectre-PHT, where transient instructions execute along a restricted mispredicted path, Spectre-BTB enables redirection of transient control flow to an arbitrary destination. Adopting established techniques from return-oriented programming (ROP) attacks, but abusing BTB poisoning instead of application-level vulnerabilities, selected code “gadgets” found in the victim address space may be chained together to construct arbitrary transient instruction sequences. Hence, while the success of Spectre-PHT critically relies on unintended leakage along the mispredicted code path, ROP-style gadget abuse in Spectre-BTB enables more direct construction of covert channels that expose secrets from the transient domain.",
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        names: [
            {
                title: "Spectre variant 2",
                url: "https://spectreattack.com/"
            },
            {
                title: "Branch Target Injection (BTI)",
                url: "https://software.intel.com/security-software-guidance/api-app/sites/default/files/336983-Intel-Analysis-of-Speculative-Execution-Side-Channels-White-Paper.pdf"
            }

        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        poc: [{
                title: "https://github.com/IAIK/transientfail",
                url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB"
            },
            {
                title: "https://github.com/google/safeside",
                url: "https://github.com/google/safeside/tree/master/demos"
            }
        ],
        color: color.group
    }, {
        id: 4,
        title: "Spectre-RSB",
        alias: "ret2spec",
        img: "spectre.svg",
        father: 1,
        description: "Maisuradze and Rossow and Koruyeh et al. introduced a Spectre variant that exploits the Return Stack Buffer (RSB). The RSB is a small per-core microarchitectural buffer that stores the virtual addresses following the N most recent <code>call</code> instructions. When encountering a <code>ret</code> instruction, the CPU pops the topmost element from the RSB to predict the return flow.<p>Misspeculation arises whenever the RSB layout diverges from the actual return addresses on the software stack. Such disparity for instance naturally occurs when restoring kernel/enclave/user stack pointers upon protection domain switches.<p>Furthermore, same-address-space adversaries may explicitly overwrite return addresses on the software stack, or transiently execute <code>call</code> instructions which update the RSB without committing architectural effects. This may allow untrusted code executing in a sandbox to transiently divert return control flow to interesting code gadgets outside of the sandboxed environment.<p>Due to the fixed-size nature of the RSB, a special case of misspeculation occurs for deeply nested function calls. Since the RSB can only store return addresses for the N most recent calls, an underfill occurs when the software stack is unrolled. In this case, the RSB can no longer provide accurate predictions. Starting from Skylake, Intel CPUs use the BTB as a fallback, thus allowing Spectre-BTB-style attacks triggered by <code>ret</code> instructions.",
        sources: [
            sources["Maisuradze2018"],
            sources["Koruyeh2018"],
            sources["Canella2018"]
        ],
        names: [
            {
                title: "ret2spec",
                url: "https://arxiv.org/pdf/1807.10364.pdf",
            },
            {
                title: "SpectreRSB",
                url: "https://www.usenix.org/conference/woot18/presentation/koruyeh",
            },
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB"
        }],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.group
    }, {
        id: 5,
        title: "Spectre-STL",
        alias: "Spectre v4",
        img: "spectre.svg",
        father: 1,
        description: "Speculation in modern CPUs is not restricted to control flow but also includes predicting dependencies in the data flow. A common type, a Store To Load (STL) dependency, requires that a memory load shall not be executed before all preceding stores writing to the same location have completed. However, even before the addresses of all prior stores in the pipeline are known, the CPU's memory disambiguator may predict which loads can already be executed speculatively. <p>When the disambiguator predicts that a load does not have a dependency on a prior store, the load reads data from the L1 data cache. When the addresses of all prior stores are known, the prediction is verified. If any overlap is found, the load and all following instructions are re-executed. </p><p>Jann Horn (Google Project Zero) showed how mispredictions by the memory disambiguator could be abused to speculatively bypass store instructions. Like previous attacks, Spectre-STL adversaries rely on an appropriate transient instruction sequence to leak unsanitized stale values via a microarchitectural covert channel. Furthermore, operating on stale pointer values may speculatively break type and memory safety guarantees in the transient execution domain. </p>",
        sources: [
            sources["Horn2018"],
            sources["Canella2018"]
        ],
        poc: [{
                title: "https://github.com/IAIK/transientfail",
                url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/STL"
            },
            {
                title: "https://github.com/google/safeside",
                url: "https://github.com/google/safeside/tree/master/demos"
            }
        ],
        names: [
            {
                title: "Spectre variant 4",
                url: "https://software.intel.com/security-software-guidance/software-guidance/speculative-store-bypass"
            },
            {
                title: "Speculative Store Bypass (SSB)",
                url: "https://software.intel.com/security-software-guidance/software-guidance/speculative-store-bypass"
            },
        ],
        cve: [{
            title: "CVE-2018-3639",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2018-3639"
        }],
        affects: [
            {
                title: "Intel",
                url: "https://software.intel.com/security-software-guidance/software-guidance/speculative-store-bypass"
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            },
        ],
        color: color.works
    }, {
        id: 6,
        title: "Cross-address-space",
        father: 2,
        text_top: "mistraining strategy",
        description: "In a cross-address-space scenario, an attacker has two options. In the first, an attacker can mirror the virtual address space layout of the victim on a hyperthread (same physical core) and mistrain at the exact same virtual address as the victim branch. We refer to this as cross-address-space in-place (CA-IP). In the second, the attacker mistrains the PHT on a congruent virtual address in a different address space. We refer to this as cross-address-space out-of-place (CA-OP). Cross-address-space attacks are possible because the PHT is shared between hyperthreads on the same logical core.",
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT"
        }],
        color: color.group
    }, {
        id: 7,
        title: "Same-address-space",
        father: 2,
        description: "In a same-address-space scenario, an attacker has two options. The first option is to mistrain the exact location that is later on attacked. We refer to this as same-address-space in-place (SA-IP), In the second scenario, a congruent address is used for the mistraining. This is possible because only a subset of the virtual address is used for indexing the PHT. We refer to this as same-address-space out-of-place (SA-OP).",
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT"
        }],
        color: color.group
    }, {
        id: 8,
        title: "Cross-address-space",
        father: 3,
        description: "In a cross-address-space scenario, an attacker has two options. In the first, an attacker can mirror the virtual address space layout of the victim on a hyperthread (same physical core) and mistrain at the exact same virtual address as the victim branch. We refer to this as cross-address-space in-place (CA-IP). In the second, the attacker mistrains the BTB on a congruent virtual address in a different address space. We refer to this as cross-address-space out-of-place (CA-OP). Cross-address-space attacks are possible because the BTB is shared between hyperthreads on the same logical core.",
        sources: [
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB"
        }],
        color: color.group
    }, {
        id: 9,
        title: "Same-address-space",
        father: 3,
        description: "In a same-address-space scenario, an attacker has two options. The first option is to mistrain the exact location that is later on attacked. We refer to this as same-address-space in-place (SA-IP), In the second scenario, a congruent address is used for the mistraining. This is possible because only a subset of the virtual address is used for indexing the BTB. We refer to this as same-address-space out-of-place (SA-OP).",
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB"
        }],
        color: color.group
    }, {
        id: 10,
        title: "Cross-address-space",
        father: 4,
        description: "In a cross-address-space RSB attack, an attacker cannot simply run on a hyperthread to influence the RSB. This is because the RSB is not shared between hyperthreads. Therefore, an attacker has to interleave the execution of their program with the victim's program to poison the RSB. This is possible in both in-place and out-of-place scenarios.",
        sources: [
            sources["Maisuradze2018"],
            sources["Koruyeh2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB"
        }],
        color: color.group
    }, {
        id: 11,
        title: "Same-address-space",
        father: 4,
        description: "In a same-address-space RSB attack, an attacker can explicitly overwrite the return address on the software stack or transiently execute <code>call</code> instructions. Another cause for misspeculation is deeply nested function calls. This is due to the limited size of the RSB. One natural occurrence of RSB misspeculation is when restoring the kernel/enclave/user stack pointer upon switching protection domains. In all those cases, the execution might be diverted to a special code gadget that leaks data.",
        sources: [
            sources["Maisuradze2018"],
            sources["Koruyeh2018"],
            sources["Canella2018"]
        ],
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB"
        }],
        color: color.group
    }, {
        id: 12,
        title: "PHT-CA-IP",
        img: "spectre.svg",
        text_top: "in-place (IP) vs. out-of-place (OP)",
        father: 6,
        description: "The cross-address-space, in-place variant of Spectre-PHT.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT/ca_ip"
        }],
        sources: [
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        color: color.works
    }, {
        id: 13,
        title: "PHT-CA-OP",
        img: "spectre.svg",
        father: 6,
        description: "The cross-address-space, out-of-place variant of Spectre-PHT.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT/ca_oop"
        }],
        sources: [
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        color: color.works
    }, {
        id: 14,
        title: "PHT-SA-IP",
        alias: "Spectre v1",
        img: "spectre.svg",
        father: 7,
        description: "The same-address-space, in-place variant of Spectre-PHT. This was one of the first discovered variants. It is the best-known variant of Spectre-PHT.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT/sa_ip"
        }],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        sources: [
            sources["Kocher2019"],
            sources["Kiriansky2018"],
            sources["Canella2018"]
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        color: color.works
    }, {
        id: 15,
        title: "PHT-SA-OP",
        img: "spectre.svg",
        father: 7,
        description: "The same-address-space, out-of-place variant of Spectre-PHT.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/PHT/sa_oop"
        }],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        sources: [
            sources["Canella2018"]
        ],
        cve: [{
            title: "CVE-2017-5753",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5753"
        }],
        color: color.works
    }, {
        id: 16,
        title: "BTB-CA-IP",
        alias: "Spectre v2",
        img: "spectre.svg",
        father: 8,
        description: "The cross-address-space, in-place variant of Spectre-BTB. This was one of the first discovered variants.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB/ca_ip"
        }],
        sources: [
            sources["Kocher2019"],
            sources["Chen2019"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.works
    }, {
        id: 17,
        title: "BTB-CA-OP",
        alias: "Spectre v2",
        img: "spectre.svg",
        father: 8,
        description: "The cross-address-space, out-of-place variant of Spectre-BTB. This was one of the first discovered variants.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB/ca_oop"
        }],
        sources: [
            sources["Kocher2019"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.works
    }, {
        id: 18,
        title: "BTB-SA-IP",
        img: "spectre.svg",
        father: 9,
        description: "The same-address-space, in-place variant of Spectre-BTB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB/sa_ip"
        }],
        sources: [
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            }
        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.works
    }, {
        id: 19,
        title: "BTB-SA-OP",
        alias: "Spectre v2",
        img: "spectre.svg",
        father: 9,
        description: "The same-address-space, out-of-place variant of Spectre-BTB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/BTB/sa_oop"
        }],
        sources: [
            sources["Chen2019"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
        ],
        cve: [{
            title: "CVE-2017-5715",
            url: "https://nvd.nist.gov/vuln/detail/CVE-2017-5715"
        }],
        color: color.works
    }, {
        id: 20,
        title: "RSB-CA-IP",
        alias: "ret2spec",
        img: "spectre.svg",
        father: 10,
        description: "The cross-address-space, in-place variant of Spectre-RSB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB/ca_ip"
        }],
        sources: [
            sources["Koruyeh2018"],
            sources["Maisuradze2018"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
        ],
        color: color.works
    }, {
        id: 21,
        title: "RSB-CA-OP",
        img: "spectre.svg",
        father: 10,
        description: "The cross-address-space, out-of-place variant of Spectre-RSB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB/ca_oop"
        }],
        sources: [
            sources["Koruyeh2018"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
        ],
        color: color.works
    }, {
        id: 22,
        title: "RSB-SA-IP",
        alias: "ret2spec",
        img: "spectre.svg",
        father: 11,
        description: "The same-address-space, in-place variant of Spectre-RSB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB/sa_ip"
        }],
        sources: [
            sources["Maisuradze2018"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            },
        ],
        color: color.works
    }, {
        id: 23,
        title: "RSB-SA-OP",
        alias: "ret2spec",
        img: "spectre.svg",
        father: 11,
        description: "The same-address-space, out-of-place variant of Spectre-RSB.",
        poc: [{
            title: "https://github.com/IAIK/transientfail",
            url: "https://github.com/IAIK/transientfail/tree/master/pocs/spectre/RSB/sa_oop"
        }],
        sources: [
            sources["Koruyeh2018"],
            sources["Maisuradze2018"],
            sources["Canella2018"]
        ],
        affects: [
            {
                title: "Intel",
            },
            {
                title: "AMD",
            },
            {
                title: "ARM",
            },        ],
        color: color.works
    },
];
var current_data = data;
