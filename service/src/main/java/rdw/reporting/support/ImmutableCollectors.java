package rdw.reporting.support;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.ImmutableSortedSet;

import java.util.function.Function;
import java.util.stream.Collector;

public final class ImmutableCollectors {

	private ImmutableCollectors() {
	}

	public static <T> Collector<T, ?, ImmutableList<T>> toImmutableList() {
		return Collector.of(
			ImmutableList.Builder::new,
			ImmutableList.Builder::add,
			(l, r) -> l.addAll(r.build()),
			(Function<ImmutableList.Builder<T>, ImmutableList<T>>) ImmutableList.Builder::build
		);
	}

	public static <T> Collector<T, ?, ImmutableSet<T>> toImmutableSet() {
		return Collector.of(
			ImmutableSet.Builder::new,
			ImmutableSet.Builder::add,
			(l, r) -> l.addAll(r.build()),
			(Function<ImmutableSet.Builder<T>, ImmutableSet<T>>) ImmutableSet.Builder::build
		);
	}

	public static <T extends Comparable<?>> Collector<T, ?, ImmutableSortedSet<T>> toNaturalImmutableSortedSet() {
		return Collector.of(
			ImmutableSortedSet::naturalOrder,
			ImmutableSortedSet.Builder::add,
			(l, r) -> l.addAll(r.build()),
			(Function<ImmutableSortedSet.Builder<T>, ImmutableSortedSet<T>>) ImmutableSortedSet.Builder::build
		);
	}

	public static <T, K, V> Collector<T, ?, ImmutableMap<K, V>> toImmutableMap(
		Function<? super T, ? extends K> keyMapper,
		Function<? super T, ? extends V> valueMapper) {
		return Collector.of(
			ImmutableMap.Builder::new,
			(b, t) -> b.put(keyMapper.apply(t), valueMapper.apply(t)),
			(l, r) -> l.putAll(r.build()),
			(Function<ImmutableMap.Builder<K, V>, ImmutableMap<K, V>>) ImmutableMap.Builder::build
		);
	}

}