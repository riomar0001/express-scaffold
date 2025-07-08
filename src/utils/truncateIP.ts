import ipaddr from "ipaddr.js";

export function truncateIp(ip: string): string {
  try {
    const parsedIp = ipaddr.parse(ip);

    if (parsedIp.kind() === "ipv4") {

      const ipv4 = parsedIp as ipaddr.IPv4;

      const octets = ipv4.octets;

      return `${octets[0]}.${octets[1]}.${octets[2]}.0`;
    }

    if (parsedIp.kind() === "ipv6") {
      const ipv6 = parsedIp as ipaddr.IPv6;

      const segments = ipv6.parts;

      const truncatedSegments = segments
        .slice(0, 4)
        .concat(new Array(4).fill(0));

      return ipaddr
        .fromByteArray(
          truncatedSegments.flatMap((seg) => [seg >> 8, seg & 0xff])
        )
        .toString();
    }

    return ip;
  } catch (e) {
    return ip;
  }
}
